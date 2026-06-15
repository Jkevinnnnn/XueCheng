package com.xuecheng.content.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.xuecheng.base.exception.XueChengPlusException;
import com.xuecheng.content.mapper.CourseTeacherMapper;
import com.xuecheng.content.model.po.CourseTeacher;
import com.xuecheng.content.service.CourseTeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseTeacherServiceImpl implements CourseTeacherService {

    @Autowired
    CourseTeacherMapper courseTeacherMapper;

    @Override
    public List<CourseTeacher> listByCourseId(Long courseId) {
        LambdaQueryWrapper<CourseTeacher> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(CourseTeacher::getCourseId, courseId);
        return courseTeacherMapper.selectList(queryWrapper);
    }

    @Override
    public CourseTeacher saveCourseTeacher(CourseTeacher courseTeacher) {
        if (courseTeacher.getCourseId() == null) {
            XueChengPlusException.cast("课程id不能为空");
        }
        if (courseTeacher.getId() == null) {
            courseTeacherMapper.insert(courseTeacher);
        } else {
            courseTeacherMapper.updateById(courseTeacher);
        }
        return courseTeacher;
    }

    @Override
    public void deleteCourseTeacher(Long courseId, Long courseTeacherId) {
        LambdaQueryWrapper<CourseTeacher> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(CourseTeacher::getCourseId, courseId)
                .eq(CourseTeacher::getId, courseTeacherId);
        courseTeacherMapper.delete(queryWrapper);
    }
}
