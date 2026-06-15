package com.xuecheng.content.api;

import com.xuecheng.content.model.po.CourseTeacher;
import com.xuecheng.content.service.CourseTeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CourseTeacherController {

    @Autowired
    CourseTeacherService courseTeacherService;

    @GetMapping("/courseTeacher/list/{courseId}")
    public List<CourseTeacher> list(@PathVariable Long courseId) {
        return courseTeacherService.listByCourseId(courseId);
    }

    @PostMapping("/courseTeacher")
    public CourseTeacher save(@RequestBody CourseTeacher courseTeacher) {
        return courseTeacherService.saveCourseTeacher(courseTeacher);
    }

    @DeleteMapping("/courseTeacher/course/{courseId}/{courseTeacherId}")
    public void delete(@PathVariable Long courseId, @PathVariable Long courseTeacherId) {
        courseTeacherService.deleteCourseTeacher(courseId, courseTeacherId);
    }
}
