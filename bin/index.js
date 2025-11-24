#!/usr/bin/env node

import { intro, outro, isCancel, cancel, text, select } from "@clack/prompts";

intro(`create-aunty`);

const meaning = await text({
  message: "What is the meaning of life?",
  placeholder: "Not sure",
  initialValue: "42",
  validate(value) {
    if (value.length === 0) return `Value is required!`;
  },
});

if (isCancel(meaning)) {
  cancel("Meaning of life is unknown");
  process.exit(0);
}

const projectType = await select({
  message: "Pick a project type.",
  options: [
    { value: "ts", label: "TypeScript" },
    { value: "js", label: "JavaScript" },
    { value: "coffee", label: "CoffeeScript", hint: "oh no" },
  ],
});

// Do stufff
outro(`You're all set!`);
