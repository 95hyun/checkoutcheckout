package com.toy.checkoutcheckout.domain.plan.dto;

import com.toy.checkoutcheckout.domain.plan.entity.StudyPlan;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class StudyPlanDto {

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String date;
        private String content;
        private Integer plannedDuration;
        private boolean isCompleted;

        public static Response fromEntity(StudyPlan studyPlan) {
            return Response.builder()
                    .id(studyPlan.getId())
                    .date(studyPlan.getDate().toString())
                    .content(studyPlan.getContent())
                    .plannedDuration(studyPlan.getPlannedDuration())
                    .isCompleted(studyPlan.isCompleted())
                    .build();
        }
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        private String content;
        private Integer plannedDuration;
    }
}
