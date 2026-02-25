export interface SubDepartment {
  name: string;
  subs?: string[];
}

export interface DepartmentCategory {
  name: string;
  departments: SubDepartment[];
}

export const departmentCategories: DepartmentCategory[] = [
  {
    name: "Electrical Engineering & Computing",
    departments: [
      { name: "Electrical & Computer Engineering", subs: ["Power Engineering", "Control Engineering", "Communication Engineering", "Computer Engineering"] },
      { name: "Software Engineering" },
      { name: "Information Technology" },
      { name: "Information Science" },
    ],
  },
  {
    name: "Mechanical, Chemical & Materials Eng.",
    departments: [
      { name: "Mechanical Engineering", subs: ["Thermal Engineering", "Manufacturing Engineering", "Automotive Engineering"] },
      { name: "Chemical Engineering", subs: ["Process Engineering", "Petrochemical Engineering"] },
      { name: "Materials Science & Engineering" },
    ],
  },
  {
    name: "Civil Engineering and Architecture",
    departments: [
      { name: "Civil Engineering", subs: ["Structural Engineering", "Water Resources Engineering", "Highway Engineering"] },
      { name: "Architecture" },
      { name: "Urban Planning" },
    ],
  },
  {
    name: "Applied Natural Science",
    departments: [
      { name: "Physics" },
      { name: "Chemistry" },
      { name: "Mathematics" },
      { name: "Biology" },
      { name: "Geology" },
    ],
  },
  {
    name: "Division of Freshman Program",
    departments: [
      { name: "Natural Science Stream" },
      { name: "Social Science Stream" },
    ],
  },
  {
    name: "Continuing Educations",
    departments: [
      { name: "Weekend Program" },
      { name: "Summer Program" },
      { name: "Distance Education" },
    ],
  },
  {
    name: "Postgraduate Programs",
    departments: [
      { name: "Masters Programs" },
      { name: "PhD Programs" },
      { name: "Research & Publications" },
    ],
  },
];

// Flat list of all service categories for complaint routing
export const serviceCategories = [
  "Dormitory",
  "Cafeteria",
  "Library",
  "Sports Office",
  "Health Center",
  "IT Services",
  "Transportation",
  "Other Services",
];

// All department names flattened
export const getAllDepartmentNames = (): string[] => {
  const names: string[] = [];
  departmentCategories.forEach((cat) => {
    names.push(cat.name);
    cat.departments.forEach((dept) => {
      names.push(dept.name);
      dept.subs?.forEach((sub) => names.push(sub));
    });
  });
  return names;
};
