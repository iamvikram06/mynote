import {
  enqueueSave,
  subscribeNoteStatus,
  _drainQueueForTest,
} from "../utils/sync";

describe("sync queue", () => {
  jest.setTimeout(20000);

  test("enqueueSave retries and eventually errors after max attempts", async () => {
    const failingSave = async () => {
      throw new Error("fail");
    };

    const statuses = [];
    const unsub = subscribeNoteStatus("note1", (s) => statuses.push(s));
    enqueueSave("user1", { id: "note1", title: "t" }, failingSave);

    // wait for queue to drain (max attempts backoff)
    await _drainQueueForTest();
    // after running, status should include pending, syncing, retrying, error
    expect(statuses).toEqual(
      expect.arrayContaining(["pending", "syncing", "retrying", "error"])
    );
    unsub();
  });

  test("enqueueSave succeeds and emits synced", async () => {
    const successful = async () => {
      return Promise.resolve();
    };
    const statuses = [];
    const unsub = subscribeNoteStatus("note2", (s) => statuses.push(s));
    enqueueSave("user1", { id: "note2", title: "t" }, successful);
    await _drainQueueForTest();
    expect(statuses).toEqual(
      expect.arrayContaining(["pending", "syncing", "synced"])
    );
    unsub();
  });
});
