import { syncDatabase, MuscleGroup, LearningContent, RoutineTemplate, ExerciseCatalog } from "../lib/models";
import { sequelize } from "../lib/db";
import { muscleGroups, learningContents } from "./learning-content";
import { templateSeeds } from "./templates-content";
import { catalogoExercises } from "./exercise-catalog";

async function main() {
  console.log("Syncing database schema...");
  await syncDatabase({ alter: true });
  console.log("Schema ready.");

  for (const mg of muscleGroups) {
    const [row, created] = await MuscleGroup.findOrCreate({
      where: { name: mg.name },
      defaults: mg,
    });
    console.log(`${created ? "Created" : "Exists"} MuscleGroup "${row.name}" (${row.minReps}-${row.maxReps})`);
  }

  for (const c of learningContents) {
    const [row, created] = await LearningContent.findOrCreate({
      where: { slug: c.slug },
      defaults: c,
    });
    if (!created) {
      await row.update(c);
    }
    console.log(`${created ? "Created" : "Updated"} LearningContent "${row.slug}"`);
  }

  // Catálogo de exercises (resolver grupos por name).
  const groupByName = new Map<string, MuscleGroup>();
  for (const mg of muscleGroups) {
    const group = await MuscleGroup.findOne({ where: { name: mg.name } });
    if (group) groupByName.set(mg.name, group);
  }

  let catalogOrder = 0;
  for (const c of catalogoExercises) {
    const group = groupByName.get(c.group);
    if (!group) {
      console.warn(`Catálogo: grupo "${c.group}" no encontrado para "${c.name}"`);
      continue;
    }
    catalogOrder++;
    const [row, created] = await ExerciseCatalog.findOrCreate({
      where: { name: c.name },
      defaults: {
        name: c.name,
        muscleGroupId: group.id,
        pattern: c.pattern,
        weightType: c.weightType,
        description: c.description,
        order: catalogOrder,
      },
    });
    if (!created) {
      await row.update({
        muscleGroupId: group.id,
        pattern: c.pattern,
        weightType: c.weightType,
        description: c.description,
        order: catalogOrder,
      });
    }
    console.log(`${created ? "Created" : "Updated"} ExerciseCatalog "${row.name}"`);
  }

  for (const t of templateSeeds) {
    const [row, created] = await RoutineTemplate.findOrCreate({
      where: { name: t.name },
      defaults: {
        name: t.name,
        description: t.description,
        level: t.level,
        tags: t.tags,
        articles: t.articles,
        authorId: null,
        isPublic: true,
        isSeed: true,
        content: t.content,
      },
    });
    if (!created) {
      await row.update({
        description: t.description,
        level: t.level,
        tags: t.tags,
        articles: t.articles,
        authorId: null,
        isPublic: true,
        isSeed: true,
        content: t.content,
      });
    }
    console.log(`${created ? "Created" : "Updated"} RoutineTemplate "${row.name}"`);
  }

  console.log("Seed completed.");
  await sequelize.close();
}

main().catch(async (err) => {
  console.error("Seed failed:", err);
  await sequelize.close();
  process.exit(1);
});
