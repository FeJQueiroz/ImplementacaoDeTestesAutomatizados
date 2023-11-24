import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import Task from "../src/task.js";
import { setTimeout } from "node:timers/promises";
describe("Task Test Suite", () => {
  let _logMock;
  let _task;
  beforeEach(() => {
    _logMock = jest.spyOn(console, console.log.name).mockImplementation();

    _task = new Task();
  });

  it.skip("should only run tasks that are due without fake timers (slow)", async () => {
    const tasks = [
      {
        name: "Task-Will-Run-In-5-Secs",
        dueAt: new Date(Date.now() + 5000), // 5 secs
        fn: jest.fn(),
      },
      {
        name: "Task-Will-Run-In-5-Secs",
        dueAt: new Date(Date.now() + 10000), // 10secs
        fn: jest.fn(),
      },
    ];

    // Act
    _task.save(tasks.at(0));
    _task.save(tasks.at(1));

    _task.run(200); // 200ms

    await setTimeout(11000); // 11_0000
    expect(tasks.at(0).fn).toHaveBeenCalled();
    expect(tasks.at(1).fn).toHaveBeenCalled();
  }, 15e3); // configurar para o jest aguardar 15 segundos nesse test

  it("should only run tasks that are due with fake timers (fast)", async () => {
    jest.useFakeTimers();

    const tasks = [
      {
        name: "Task-Will-Run-In-5-Secs",
        dueAt: new Date(Date.now() + 5000), // 5 secs
        fn: jest.fn(),
      },
      {
        name: "Task-Will-Run-In-5-Secs",
        dueAt: new Date(Date.now() + 10000), // 10secs
        fn: jest.fn(),
      },
    ];

    _task.save(tasks.at(0));
    _task.save(tasks.at(1));

    _task.run(200); // 200ms

    jest.advanceTimersByTime(4000);

    expect(tasks.at(0).fn).not.toHaveBeenCalled();
    expect(tasks.at(1).fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2000);

    expect(tasks.at(0).fn).toHaveBeenCalled();
    expect(tasks.at(1).fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(4000);

    expect(tasks.at(1).fn).toHaveBeenCalled();

    jest.useRealTimers();
  });
});
