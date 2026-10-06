import type { FC } from "react";

import type { TemplateSegmentWithExercises } from "@/data/workout-templates/workout-state";

import { WorkoutTemplateSegmentExerciseReps } from "./WorkoutTemplateSegmentExerciseReps";
import { InnerCard } from "@/components/InnerCard";

type WorkoutTemplateSegmentProps = {
  segment: TemplateSegmentWithExercises;
};

export const WorkoutTemplateSegment: FC<WorkoutTemplateSegmentProps> = ({ segment }) => {
  return (
    <InnerCard as="section">
      <p className="text-sm font-medium">{segment.sets} sets</p>
      <p className="mt-2 text-sm text-muted-foreground">
        {segment.exercises.map((exercise, exerciseIndex) => (
          <span key={`${exercise.exerciseId}-${exercise.exerciseOrder}-${exerciseIndex}`}>
            {exercise.exerciseName ?? `Exercise #${exercise.exerciseId}`}
            {exerciseIndex < segment.exercises.length - 1 ? ", " : null}
          </span>
        ))}
      </p>
      <WorkoutTemplateSegmentExerciseReps segment={segment} />
    </InnerCard>
  );
};
