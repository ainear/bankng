import { describe, expect, it } from "vitest";
import { filterLeads } from "./filter";

const leads = [
  { status: "new", assignedToId: null, contextType: "product" },
  { status: "contacted", assignedToId: "banker-1", contextType: "bank" },
  { status: "qualified", assignedToId: "banker-1", contextType: "category" }
];

describe("filterLeads", () => {
  it("filters by status", () => {
    expect(filterLeads({ leads, status: "contacted" })).toHaveLength(1);
  });

  it("filters by assignee", () => {
    expect(filterLeads({ leads, assignee: "banker-1" })).toHaveLength(2);
  });

  it("filters unassigned leads", () => {
    expect(filterLeads({ leads, assignee: "unassigned" })).toHaveLength(1);
  });
});
