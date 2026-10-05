import { z } from "zod";

const executionTypeValidator = z.enum(["repetition", "distance", "time"]);
const exerciseWeightUnitValidator = z.enum(["lbs", "kg"]);
const durationUnitValidator = z.enum(["seconds", "minutes", "hours"]);
const distanceUnitValidator = z.enum(["feet", "yards", "miles", "km"]);

export const workoutTemplateSegmentExerciseMeasurementValidator = z.object({
  setOrder: z.number().describe("The order of the set within the exercise"),
  reps: z.string().describe("The number of reps for the set").nullable(),
  repsToFailure: z.boolean().describe("Whether the set was performed to failure").nullable(),
  weightUsed: z.string().describe("The weight used for the set").nullable(),
  duration: z.string().describe("The duration of the set").nullable(),
  distance: z.string().describe("The distance covered in the set").nullable(),
});

export const workoutTemplateSegmentExerciseValidator = z.object({
  exerciseOrder: z.number().describe("The order of the exercise within the segment"),
  exerciseName: z.string().describe("The name of the exercise"),
  executionType: executionTypeValidator.describe("How the exercise is performed").nullable(),
  exerciseWeightUnit: exerciseWeightUnitValidator.describe("The unit used for weight").nullable(),
  durationUnit: durationUnitValidator.describe("The unit used for duration").nullable(),
  distanceUnit: distanceUnitValidator.describe("The unit used for distance").nullable(),
  measurements: z.array(workoutTemplateSegmentExerciseMeasurementValidator).describe("The measurements for each set of the exercise"),
});

export const templateSegmentWithExercisesValidator = z.object({
  segmentOrder: z.number().describe("The order of the segment within the workout template"),
  sets: z.number().describe("The number of sets in the segment"),
  exercises: z.array(workoutTemplateSegmentExerciseValidator).describe("The exercises in the segment"),
});

export const workoutTemplateValidator = z.object({
  name: z.string().describe("The name of the workout template"),
  uuid: z.string().describe("Unique identifier for the workout template"),
  description: z.string().describe("The description of the workout template"),
  segments: z.array(templateSegmentWithExercisesValidator).describe("The segments of the workout template"),
});

export const promptOutputSchema = z.object({
  commentary: z.string().describe("The output from the llm, explaining what it did and why"),
  workouts: z.array(workoutTemplateValidator),
});
