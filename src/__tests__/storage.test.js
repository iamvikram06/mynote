import { setStorageMode, saveNotes, loadNotes } from "../utils/storage";

describe("storage switching", () => {
  test("saveNotes delegates to cloud impl when cloud mode", () => {
    const calls = [];
    const impl = {
      saveUserNotesBulk: jest.fn((userId, notes) => {
        calls.push({ userId, notes });
        return Promise.resolve();
      }),
      fetchUserNotes: jest.fn(),
      saveUserNote: jest.fn(),
    };

    setStorageMode("cloud", impl, "user1");
    const data = [{ id: "n1", title: "t" }];
    saveNotes(data);
    expect(impl.saveUserNotesBulk).toHaveBeenCalled();
  });

  test("loadNotes returns array from localStorage by default", () => {
    localStorage.setItem("mynote.notes.v1", JSON.stringify([{ id: "a" }]));
    const l = loadNotes();
    expect(Array.isArray(l)).toBe(true);
    expect(l.length).toBeGreaterThan(0);
  });
});
