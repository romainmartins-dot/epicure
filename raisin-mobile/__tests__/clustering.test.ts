import { INITIAL_REGION, MIN_CLUSTER_DELTA } from "../config/map";
import mock from "../data/mock";
import { getAll, getList } from "../services/adresses";

describe("mock data", () => {
  it("contains 19 adresses", () => {
    expect(mock).toHaveLength(19);
  });

  it("all coordinates are valid numbers", () => {
    mock.forEach(({ nom, latitude, longitude }) => {
      expect(isNaN(parseFloat(latitude))).toBe(false);
      expect(isNaN(parseFloat(longitude))).toBe(false);
    });
  });

  it("all adresses have unique ids", () => {
    const ids = mock.map((a) => a.id);
    expect(new Set(ids).size).toBe(mock.length);
  });
});

describe("adresses service (mock mode)", () => {
  it("getAll returns 19 adresses", async () => {
    const data = await getAll();
    expect(data).toHaveLength(19);
  });

  it("getList paginates correctly", async () => {
    const { data, total } = await getList(undefined, 10, 0);
    expect(data).toHaveLength(10);
    expect(total).toBe(19);

    const page2 = await getList(undefined, 10, 10);
    expect(page2.data).toHaveLength(9);
  });

  it("getList filters by ville", async () => {
    const { data, total } = await getList("Lille");
    expect(total).toBe(19);
    expect(data.every((a) => a.ville === "Lille")).toBe(true);
  });
});

describe("clustering invariants", () => {
  it("initial delta ensures 1 cluster (≥ MIN_CLUSTER_DELTA)", () => {
    expect(INITIAL_REGION.latitudeDelta).toBeGreaterThanOrEqual(MIN_CLUSTER_DELTA);
  });

  it("all 19 pins fit within Lille bounding box", () => {
    const lats = mock.map((a) => parseFloat(a.latitude));
    const lons = mock.map((a) => parseFloat(a.longitude));
    expect(Math.max(...lats) - Math.min(...lats)).toBeLessThan(0.025);
    expect(Math.max(...lons) - Math.min(...lons)).toBeLessThan(0.015);
  });
});
