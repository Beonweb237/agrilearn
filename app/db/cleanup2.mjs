import mysql from 'mysql2/promise';

const conn = await mysql.createConnection('mysql://3cesHJwcy9b9ueg.root:cOCMXXckg09ehjsuoShdfHxA485uZ9VO@ep-t4ni387b5e83b7519dc8.epsrv-t4n281l4mrmemi4zls9a.ap-southeast-1.privatelink.aliyuncs.com:4000/19e7cbdb-7922-8fdf-8000-090afdab4055');

// For each course, delete all lessons except the first 12 (lowest IDs)
for (let courseId = 1; courseId <= 10; courseId++) {
  // Get lesson IDs to keep (first 12)
  const [keepRows] = await conn.execute(
    'SELECT id FROM lessons WHERE course_id = ? ORDER BY id ASC LIMIT 12',
    [courseId]
  );
  const keepIds = keepRows.map(r => r.id);
  
  // Get lesson IDs to delete (everything else for this course)
  const [allRows] = await conn.execute(
    'SELECT id FROM lessons WHERE course_id = ?',
    [courseId]
  );
  const deleteIds = allRows.map(r => r.id).filter(id => !keepIds.includes(id));
  
  if (deleteIds.length > 0) {
    const idList = deleteIds.join(',');
    
    // Delete quiz options for related quizzes
    await conn.execute(
      `DELETE qo FROM quiz_options qo 
       JOIN quiz_questions qq ON qo.question_id = qq.id 
       JOIN quizzes q ON qq.quiz_id = q.id 
       WHERE q.lesson_id IN (${idList})`
    );
    
    // Delete quiz questions
    await conn.execute(
      `DELETE qq FROM quiz_questions qq 
       JOIN quizzes q ON qq.quiz_id = q.id 
       WHERE q.lesson_id IN (${idList})`
    );
    
    // Delete quizzes
    await conn.execute(`DELETE FROM quizzes WHERE lesson_id IN (${idList})`);
    
    // Delete lessons
    await conn.execute(`DELETE FROM lessons WHERE id IN (${idList})`);
    
    console.log(`Course ${courseId}: Kept ${keepIds.length}, deleted ${deleteIds.length}`);
  }
}

// Verify
const [verify] = await conn.execute('SELECT course_id, COUNT(*) as count FROM lessons GROUP BY course_id ORDER BY course_id');
console.log('\nLessons per course after cleanup:', verify);

const [totalLessons] = await conn.execute('SELECT COUNT(*) as c FROM lessons');
const [totalQuizzes] = await conn.execute('SELECT COUNT(*) as c FROM quizzes');
const [totalQuestions] = await conn.execute('SELECT COUNT(*) as c FROM quiz_questions');
console.log('Total lessons:', totalLessons[0].c);
console.log('Total quizzes:', totalQuizzes[0].c);
console.log('Total questions:', totalQuestions[0].c);

await conn.end();
console.log("\nCleanup complete!");
