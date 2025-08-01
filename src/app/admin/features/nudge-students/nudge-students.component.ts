import { StudentDetails } from '../../data-access/models/studentsTonudge.model';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StudentService } from '../../../shared/data-access/services/student.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StudentsToNudgeDetails } from '../../data-access/models/studentsTonudge.model';
import { AdditionaInfoMessageType } from "../../../shared/enums/messages";
import { LoaderService } from '../../../shared/data-access/services/loader.service';
@Component({
  selector: 'app-nudge-students',
  templateUrl: './nudge-students.component.html',
  styleUrls: ['./nudge-students.component.scss'],
})
export class NudgeStudentsComponent implements OnInit {
  displayedColumns: string[] = ['fullName', 'universityName', 'email'];
  dataSource: MatTableDataSource<StudentDetails> =
    new MatTableDataSource<StudentDetails>([]);
  groupedData: StudentsToNudgeDetails[] = [];
  students: StudentDetails[] = [];
  isLoading: boolean = false;
  noStudentsToNudgeMessage: string = AdditionaInfoMessageType.NO_STUDENTS_TO_NUDGE;
  constructor(
    private _snackBar: MatSnackBar,
    private studentService: StudentService,
    private loader: LoaderService
  ) {}

  ngOnInit() {
    this.nudgeStudents();
    this.loader.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

  groupStudentsByYearAndSemester(students: StudentDetails[]): {
    [key: string]: {
      semesterOneTranscriptExists: StudentDetails[];
      semesterTwoTranscriptExists: StudentDetails[];
    };
  } {
    const grouped: {
      [key: string]: {
        semesterOneTranscriptExists: StudentDetails[];
        semesterTwoTranscriptExists: StudentDetails[];
      };
    } = {};

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const isFirstHalf = currentMonth <= 6;

    students.forEach((student) => {
      const year = student.year;
      if (!grouped[year]) {
        grouped[year] = {
          semesterOneTranscriptExists: [],
          semesterTwoTranscriptExists: [],
        };
      }

      if (!isFirstHalf) {
        if (year === currentYear && student.semesterOneTranscriptExists === 'Not Exists') {
          grouped[year].semesterOneTranscriptExists.push(student);
        }
        if (year === currentYear - 1 && student.semesterTwoTranscriptExists === 'Not Exists') {
          grouped[year].semesterTwoTranscriptExists.push(student);
        }
      } else {
        if (year === currentYear - 1 && student.semesterTwoTranscriptExists === 'Not Exists') {
          grouped[year].semesterTwoTranscriptExists.push(student);
        }
      }
    });
    return grouped;
  }

  nudgeStudents() {
    this.studentService.nudgeStudents().subscribe((data) => {
      if (data.results) {
        this.students = data.results;
        const grouped = this.groupStudentsByYearAndSemester(this.students);
        this.groupedData = Object.keys(grouped).map((year) => ({
          year: parseInt(year),
          semesterOneTranscriptExists:
            grouped[year].semesterOneTranscriptExists,
          semesterTwoTranscriptExists:
            grouped[year].semesterTwoTranscriptExists,
        }));
      }
    });
  }
  nudgeAllStudentsForSemester() {
    this.studentService
      .nudgeStudentsAllStudents()
      .subscribe((data) => {
        if (data.results) {
          this._snackBar.open('Email sent successfully.', 'Dismiss', {
            duration: 3000,
          });
        } else {
          this._snackBar.open(
            'Failed to send email, please try again later',
            'Dismiss',
            {
              duration: 3000,
            },
          );
        }
      });
  }
}
