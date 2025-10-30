import cronstrue from "cronstrue";

interface CronDescriptionProps {
  expression: string;
}

export function CronDescription({ expression }: CronDescriptionProps) {
  let description: string;
  try {
    description = cronstrue.toString(expression, {
      verbose: false,
      use24HourTimeFormat: true,
      locale: "en"
    });
  } catch (err) {
    description = "Invalid cron expression";
  }
  return <span className="text-xs text-muted-foreground italic">{description}</span>;
}
