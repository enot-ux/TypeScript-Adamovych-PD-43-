// Enum definitions
enum StudentStatus {
    Active = "Active",
    Academic_Leave = "Academic_Leave",
    Graduated = "Graduated",
    Expelled = "Expelled"
}

enum CourseType {
    Mandatory = "Mandatory",
    Optional = "Optional",
    Special = "Special"
}

enum Semester {
    First = "First",
    Second = "Second"
}

enum GradeEnum {
    Excellent = 5,
    Good = 4,
    Satisfactory = 3,
    Unsatisfactory = 2
}

enum Faculty {
    Computer_Science = "Computer_Science",
    Economics = "Economics",
    Law = "Law",
    Engineering = "Engineering"
}

// Interface definitions
interface Student {
    id: number;
    fullName: string;
    faculty: Faculty;
    year: number;
    status: StudentStatus;
    enrollmentDate: Date;
    groupNumber: string;
}

interface Course {
    id: number;
    name: string;
    type: CourseType;
    credits: number;
    semester: Semester;
    faculty: Faculty;
    maxStudents: number;
}

interface Grade {
    studentId: number;
    courseId: number;
    grade: GradeEnum;
    date: Date;
    semester: Semester;
}

// UniversityManagementSystem class
class UniversityManagementSystem {
    private students: Student[] = [];
    private courses: Course[] = [];
    private grades: Grade[] = [];
    private registrations: { studentId: number; courseId: number }[] = [];
    private studentIdCounter = 1;
    private courseIdCounter = 1;

    // Method to enroll a student
    enrollStudent(student: Omit<Student, "id">): Student {
        const newStudent = { ...student, id: this.studentIdCounter++ };
        this.students.push(newStudent);
        return newStudent;
    }

    // Method to register a student for a course
    registerForCourse(studentId: number, courseId: number): void {
        const student = this.students.find(s => s.id === studentId);
        const course = this.courses.find(c => c.id === courseId);

        if (!student || !course) throw new Error("Invalid student or course ID.");
        if (student.faculty !== course.faculty) throw new Error("Student and course must be in the same faculty.");
        const studentCount = this.registrations.filter(r => r.courseId === courseId).length;
        if (studentCount >= course.maxStudents) throw new Error("Course is full.");

        // Add registration record
        this.registrations.push({ studentId, courseId });
    }

    // Method to set a grade for a student
    setGrade(studentId: number, courseId: number, grade: GradeEnum): void {
        const student = this.students.find(s => s.id === studentId);
        const course = this.courses.find(c => c.id === courseId);

        if (!student || !course) throw new Error("Invalid student or course ID.");
        const isRegistered = this.registrations.some(r => r.studentId === studentId && r.courseId === courseId);
        if (!isRegistered) throw new Error("Student is not registered for the course.");

        this.grades.push({ studentId, courseId, grade, date: new Date(), semester: course.semester });
    }

    // Method to update student status
    updateStudentStatus(studentId: number, newStatus: StudentStatus): void {
        const student = this.students.find(s => s.id === studentId);
        if (!student) throw new Error("Invalid student ID.");

        if (newStatus === StudentStatus.Graduated && student.year < 4) {
            throw new Error("Student cannot graduate before completing 4 years.");
        }
        student.status = newStatus;
    }

    // Method to get students by faculty
    getStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students.filter(s => s.faculty === faculty);
    }

    // Method to get grades for a student
    getStudentGrades(studentId: number): Grade[] {
        return this.grades.filter(g => g.studentId === studentId);
    }

    // Method to get available courses
    getAvailableCourses(faculty: Faculty, semester: Semester): Course[] {
        return this.courses.filter(c => c.faculty === faculty && c.semester === semester);
    }

    // Method to calculate average grade for a student
    calculateAverageGrade(studentId: number): number {
        const studentGrades = this.grades.filter(g => g.studentId === studentId);
        if (studentGrades.length === 0) return 0;

        const total = studentGrades.reduce((sum, g) => sum + g.grade, 0);
        return total / studentGrades.length;
    }

    // Method to get a list of excellent students by faculty
    getExcellentStudentsByFaculty(faculty: Faculty): Student[] {
        const excellentStudentsIds = this.grades
            .filter(g => g.grade === GradeEnum.Excellent)
            .map(g => g.studentId);

        return this.students.filter(s => s.faculty === faculty && excellentStudentsIds.includes(s.id));
    }

    // Helper method to add a course
    addCourse(course: Omit<Course, "id">): Course {
        const newCourse = { ...course, id: this.courseIdCounter++ };
        this.courses.push(newCourse);
        return newCourse;
    }
}

// Test data
const ums = new UniversityManagementSystem();

// Add students
const student1 = ums.enrollStudent({
    fullName: "John Doe",
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date(),
    groupNumber: "CS-101"
});

const student2 = ums.enrollStudent({
    fullName: "Jane Smith",
    faculty: Faculty.Computer_Science,
    year: 2,
    status: StudentStatus.Active,
    enrollmentDate: new Date(),
    groupNumber: "CS-201"
});

const student3 = ums.enrollStudent({
    fullName: "Alice Brown",
    faculty: Faculty.Engineering,
    year: 3,
    status: StudentStatus.Active,
    enrollmentDate: new Date(),
    groupNumber: "ENG-301"
});

const student4 = ums.enrollStudent({
    fullName: "Bob Green",
    faculty: Faculty.Economics,
    year: 4,
    status: StudentStatus.Active,
    enrollmentDate: new Date(),
    groupNumber: "ECO-401"
});

// Add courses
const course1 = ums.addCourse({
    name: "Algorithms",
    type: CourseType.Mandatory,
    credits: 3,
    semester: Semester.First,
    faculty: Faculty.Computer_Science,
    maxStudents: 30
});

const course2 = ums.addCourse({
    name: "Data Structures",
    type: CourseType.Mandatory,
    credits: 4,
    semester: Semester.Second,
    faculty: Faculty.Computer_Science,
    maxStudents: 30
});

const course3 = ums.addCourse({
    name: "Thermodynamics",
    type: CourseType.Mandatory,
    credits: 3,
    semester: Semester.First,
    faculty: Faculty.Engineering,
    maxStudents: 20
});

const course4 = ums.addCourse({
    name: "Microeconomics",
    type: CourseType.Optional,
    credits: 3,
    semester: Semester.First,
    faculty: Faculty.Economics,
    maxStudents: 25
});

// Register students for courses
ums.registerForCourse(student1.id, course1.id);
ums.registerForCourse(student1.id, course2.id);
ums.registerForCourse(student2.id, course1.id);
ums.registerForCourse(student3.id, course3.id);
ums.registerForCourse(student4.id, course4.id);

// Set grades
ums.setGrade(student1.id, course1.id, GradeEnum.Excellent);
ums.setGrade(student1.id, course2.id, GradeEnum.Good);
ums.setGrade(student2.id, course1.id, GradeEnum.Satisfactory);
ums.setGrade(student3.id, course3.id, GradeEnum.Good);
ums.setGrade(student4.id, course4.id, GradeEnum.Excellent);

// Update student status
ums.updateStudentStatus(student4.id, StudentStatus.Graduated);

// Log results
console.log("Student 1 grades:", ums.getStudentGrades(student1.id));
console.log("Student 2 grades:", ums.getStudentGrades(student2.id));
console.log("Student 3 grades:", ums.getStudentGrades(student3.id));
console.log("Student 4 grades:", ums.getStudentGrades(student4.id));

// Get students by faculty
console.log("Students in Computer Science:", ums.getStudentsByFaculty(Faculty.Computer_Science));
console.log("Students in Economics:", ums.getStudentsByFaculty(Faculty.Economics));

// Get available courses
console.log("Available courses in Computer Science (Semester 1):", ums.getAvailableCourses(Faculty.Computer_Science, Semester.First));
console.log("Available courses in Engineering (Semester 1):", ums.getAvailableCourses(Faculty.Engineering, Semester.First));

// Calculate average grade for Student 1
console.log("Student 1 average grade:", ums.calculateAverageGrade(student1.id));

// Get excellent students by faculty
console.log("Excellent students in Computer Science:", ums.getExcellentStudentsByFaculty(Faculty.Computer_Science));
console.log("Excellent students in Economics:", ums.getExcellentStudentsByFaculty(Faculty.Economics));

// Verify graduated student status
console.log("Student 4 status (after graduation):", ums.getStudentsByFaculty(Faculty.Economics).find(s => s.id === student4.id)?.status);

