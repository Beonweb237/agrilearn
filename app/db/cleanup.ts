import mysql from 'mysql2/promise';

async function main() {
  const conn = await mysql.createConnection('mysql://3cesHJwcy9b9ueg.root:cOCMXXckg09ehjsuoShdfHxA485uZ9VO@ep-t4ni387b5e83b7519dc8.epsrv-t4n281l4mrmemi4zls9a.ap-southeast-1.privatelink.aliyuncs.com:4000/19e7cbdb-7922-8fdf-8000-090afdab4055');
  
  console.log("Cleaning duplicate data...");
  
  // Delete quiz options for quizzes of duplicate lessons
  await conn.execute('DELETE qo FROM quiz_options qo JOIN quiz_questions qq ON qo.question_id = qq.id JOIN quizzes q ON qq.quiz_id = q.id WHERE q.course_id > 10');
  console.log("Deleted duplicate quiz options");
  
  // Delete quiz questions for quizzes of duplicate lessons
  await conn.execute('DELETE qq FROM quiz_questions qq JOIN quizzes q ON qq.quiz_id = q.id WHERE q.course_id > 10');
  console.log("Deleted duplicate quiz questions");
  
  // Delete quizzes for duplicate courses
  await conn.execute('DELETE FROM quizzes WHERE course_id > 10');
  console.log("Deleted duplicate quizzes");
  
  // Delete lessons for duplicate courses
  await conn.execute('DELETE FROM lessons WHERE course_id > 10');
  console.log("Deleted duplicate lessons");
  
  // Delete duplicate courses (keep id 1-10)
  await conn.execute('DELETE FROM courses WHERE id > 10');
  console.log("Deleted duplicate courses");
  
  // Update badges
  await conn.execute('UPDATE badges SET course_id = NULL WHERE course_id > 10');
  console.log("Updated badges");
  
  // Verify
  const [coursesCount] = await conn.execute('SELECT COUNT(*) as c FROM courses');
  const [lessonsCount] = await conn.execute('SELECT COUNT(*) as c FROM lessons');
  const [quizzesCount] = await conn.execute('SELECT COUNT(*) as c FROM quizzes');
  
  console.log('Courses:', coursesCount);
  console.log('Lessons:', lessonsCount);
  console.log('Quizzes:', quizzesCount);
  
  await conn.end();
  console.log("Cleanup complete!");
}

main().catch(console.error);
