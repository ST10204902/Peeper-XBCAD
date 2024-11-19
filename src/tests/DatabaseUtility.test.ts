import { DatabaseUtility } from "../utils/DatabaseUtility";
import { DataSnapshot, get, IteratedDataSnapshot, DatabaseReference } from "firebase/database";

// Create interfaces for our mock data
interface MockData {
  id: number;
  name: string;
}

// Create a recursive type for DatabaseReference mock
type MockDatabaseRef = {
  key: string | null;
  root: DatabaseReference;
  parent: DatabaseReference | null;
  path: { pieces: string[]; pieceNum: number };
  ref: DatabaseReference;
  isEqual: (other: DatabaseReference) => boolean;
  toJSON: () => object;
  toString: () => string;
  push: () => DatabaseReference;
  remove: () => Promise<void>;
  set: () => Promise<void>;
  update: () => Promise<void>;
  child: () => DatabaseReference;
  onDisconnect: () => unknown;
  get: () => Promise<DataSnapshot>;
  orderByChild: () => DatabaseReference;
  orderByKey: () => DatabaseReference;
  orderByValue: () => DatabaseReference;
  startAt: () => DatabaseReference;
  endAt: () => DatabaseReference;
  equalTo: () => DatabaseReference;
  limitToFirst: () => DatabaseReference;
  limitToLast: () => DatabaseReference;
};

// Create the mock with proper typing
const mockDatabaseRef: MockDatabaseRef = {
  key: null,
  root: {} as DatabaseReference,
  parent: null,
  path: { pieces: [], pieceNum: 0 },
  ref: {} as DatabaseReference,
  isEqual: () => false,
  toJSON: () => ({}),
  toString: () => "",
  push: () => mockDatabaseRef as unknown as DatabaseReference,
  remove: () => Promise.resolve(),
  set: () => Promise.resolve(),
  update: () => Promise.resolve(),
  child: () => mockDatabaseRef as unknown as DatabaseReference,
  onDisconnect: () => ({}),
  get: () => Promise.resolve({} as DataSnapshot),
  orderByChild: () => mockDatabaseRef as unknown as DatabaseReference,
  orderByKey: () => mockDatabaseRef as unknown as DatabaseReference,
  orderByValue: () => mockDatabaseRef as unknown as DatabaseReference,
  startAt: () => mockDatabaseRef as unknown as DatabaseReference,
  endAt: () => mockDatabaseRef as unknown as DatabaseReference,
  equalTo: () => mockDatabaseRef as unknown as DatabaseReference,
  limitToFirst: () => mockDatabaseRef as unknown as DatabaseReference,
  limitToLast: () => mockDatabaseRef as unknown as DatabaseReference,
};

// Cast the mock through unknown to DatabaseReference
const databaseRef = mockDatabaseRef as unknown as DatabaseReference;

// Updated MockDataSnapshot to match Firebase's types
interface MockDataSnapshot extends Omit<DataSnapshot, "key" | "forEach"> {
  val: () => MockData;
  key: string;
  ref: DatabaseReference;
  priority: null | string | number;
  exists: () => boolean;
  hasChild: (path: string) => boolean;
  hasChildren: () => boolean;
  numChildren: () => number;
  child: (path: string) => DataSnapshot;
  forEach: (action: (child: IteratedDataSnapshot) => boolean | void) => boolean;
  exportVal: () => MockData;
  toJSON: () => object | null;
  size: number;
}

// Mock the firebase/database module
jest.mock("firebase/database", () => ({
  // Mock each function that is used from the module
  get: jest.fn(),
  ref: jest.fn(),
  getDatabase: jest.fn(),
}));

// Describe block for grouping related tests for the DatabaseUtility.getAllData function
describe("DatabaseUtility.getAllData", () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // Test case to check if getAllData returns an array of data when data exists
  it("should return an array of data when data exists", async () => {
    // Mock data to be returned by the snapshot
    const mockData: MockData[] = [
      { id: 1, name: "Test" },
      { id: 2, name: "Test2" },
    ];

    // Partial mock of DataSnapshot with exists and forEach methods
    const mockSnapshot: Partial<DataSnapshot> = {
      exists: jest.fn().mockReturnValue(true), // Mock exists method
      forEach: jest.fn(callback => {
        // Mock forEach method to iterate over mock data
        mockData.forEach(item => {
          // Create a properly typed mock snapshot
          const childSnapshot: MockDataSnapshot = {
            val: () => item,
            key: item.id.toString(), // Key is guaranteed to be string
            ref: databaseRef,
            priority: null,
            exists: () => true,
            hasChild: () => false,
            hasChildren: () => false,
            numChildren: () => 0,
            child: (_: string) => ({}) as DataSnapshot,
            forEach: () => false,
            exportVal: () => item,
            toJSON: () => item,
            size: 1,
          };

          callback(childSnapshot as unknown as IteratedDataSnapshot);
        });
        return true; // Return true to indicate successful iteration
      }),
    };

    // Mock the get function to return the mock snapshot
    (get as jest.Mock).mockResolvedValue(mockSnapshot as DataSnapshot);

    // Call the getAllData function with a test path
    const result = await DatabaseUtility.getAllData<MockData>("/test/path");

    // Assert that the result matches the mock data
    expect(result).toEqual(mockData);
  });

  // Test case to check if getAllData returns an empty array when data does not exist
  it("should return an empty array when there is an error fetching data", async () => {
    // Mock the get function to reject with an error
    (get as jest.Mock).mockRejectedValue(new Error("Fetch error"));
    // Call the getAllData function with a test path
    const result = await DatabaseUtility.getAllData("/test/path");
    // Assert that the result is an empty array
    console.info("GetAllData should print an error");
    expect(result).toEqual([]);
  });
});
