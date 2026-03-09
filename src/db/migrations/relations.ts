import { relations } from "drizzle-orm/relations";
import { userRoles, appointment, externalCalendar, athlete, appointmentDuration, activityLevel, activityLevelValues, users, roleTypes, athleteByUserProfile, athleteByUserProfileRole, nutritionAssessment, athleteSports, sports, availability, nutritionAssessmentAnswer, questionnaire, questionnaireQuestion, questionnaireType, questionnaireQuestionType, nutritionAssessmentNotesByCategory, questionnaireQuestionsCategory, nutritionIntakesPlan, nutritionIntakeDayPlan, nutritionIntakes, nutritionIntakesType, questionnaireOption, questionnaireQuestionByCategory, food, foodComponent, component, foodEquivalenceDetail, foodEquivalence, foodBrand, userAddress, foodIntake, foodIntakeEquivalence, foodPlan, foodIntakeType, athleteSnapshots, userSocial, nutritionAssessmentMedicalStudies, athleteMedicalStudies, conversations, conversationStatus, messages, mentionNotifications, events, eventParticipants, athleteDayActivity, anthropometry, athletePhotos, nutritionAssessmentPhotos, foodCategoryRelation, foodCategory, gymExercise, gymExerciseMedia, gymRoutine, gymRoutineStage, gymStage, gymSetExercise, gymSetExerciseWeight, gymWeight, gymStageSet, gymSet, colleagues, colleaguesAthleteColaboration, foodCombined, nutritionAssessmentReport, nutritionAssessmentReportComment, gymExerciseCategory, gymExerciseCategoryExercises, gymPlan, foodIntakeCommentDay, foodIntakePhotoDay, foodIntakeStarRatingDay, gymPlanRoutine, gymPlanRoutinePerformance, questionnaireQuestionsCategoryByUserRole, userPreferences, refreshTokens, folders, documents, documentPermissions, folderPermissions, foodPlanDocument, teams, subgroups, userRolesLicenses, documentWhitelist, folderWhitelist, subgroupAthletes, teamAthletes, athleteBlacklist } from "./schema.js";

export const appointmentRelations = relations(appointment, ({one}) => ({
	userRole: one(userRoles, {
		fields: [appointment.userRolesId],
		references: [userRoles.id]
	}),
	externalCalendar: one(externalCalendar, {
		fields: [appointment.externalCalendarId],
		references: [externalCalendar.id]
	}),
	athlete: one(athlete, {
		fields: [appointment.athleteId],
		references: [athlete.id]
	}),
	appointmentDuration: one(appointmentDuration, {
		fields: [appointment.durationId],
		references: [appointmentDuration.id]
	}),
}));

export const userRolesRelations = relations(userRoles, ({one, many}) => ({
	appointments: many(appointment),
	appointmentDurations: many(appointmentDuration),
	user: one(users, {
		fields: [userRoles.userId],
		references: [users.id]
	}),
	roleType: one(roleTypes, {
		fields: [userRoles.roleId],
		references: [roleTypes.id]
	}),
	externalCalendars: many(externalCalendar),
	athleteByUserProfileRoles: many(athleteByUserProfileRole),
	nutritionAssessments: many(nutritionAssessment),
	availabilities: many(availability),
	questionnaires: many(questionnaire),
	nutritionIntakesPlans: many(nutritionIntakesPlan),
	foodEquivalences: many(foodEquivalence),
	foodPlans: many(foodPlan),
	conversationStatuses: many(conversationStatus),
	messages: many(messages),
	mentionNotifications: many(mentionNotifications),
	events_createdBy: many(events, {
		relationName: "events_createdBy_userRoles_id"
	}),
	events_updatedBy: many(events, {
		relationName: "events_updatedBy_userRoles_id"
	}),
	eventParticipants_createdBy: many(eventParticipants, {
		relationName: "eventParticipants_createdBy_userRoles_id"
	}),
	eventParticipants_updatedBy: many(eventParticipants, {
		relationName: "eventParticipants_updatedBy_userRoles_id"
	}),
	athleteDayActivities: many(athleteDayActivity),
	anthropometries: many(anthropometry),
	conversations: many(conversations),
	colleagues_userRolesId: many(colleagues, {
		relationName: "colleagues_userRolesId_userRoles_id"
	}),
	colleagues_colleagueId: many(colleagues, {
		relationName: "colleagues_colleagueId_userRoles_id"
	}),
	colleagues_createdBy: many(colleagues, {
		relationName: "colleagues_createdBy_userRoles_id"
	}),
	colleagues_updatedBy: many(colleagues, {
		relationName: "colleagues_updatedBy_userRoles_id"
	}),
	colleaguesAthleteColaborations_createdBy: many(colleaguesAthleteColaboration, {
		relationName: "colleaguesAthleteColaboration_createdBy_userRoles_id"
	}),
	colleaguesAthleteColaborations_updatedBy: many(colleaguesAthleteColaboration, {
		relationName: "colleaguesAthleteColaboration_updatedBy_userRoles_id"
	}),
	gymStages_createdBy: many(gymStage, {
		relationName: "gymStage_createdBy_userRoles_id"
	}),
	gymStages_updatedBy: many(gymStage, {
		relationName: "gymStage_updatedBy_userRoles_id"
	}),
	gymStages_deletedBy: many(gymStage, {
		relationName: "gymStage_deletedBy_userRoles_id"
	}),
	gymRoutines_createdBy: many(gymRoutine, {
		relationName: "gymRoutine_createdBy_userRoles_id"
	}),
	gymRoutines_updatedBy: many(gymRoutine, {
		relationName: "gymRoutine_updatedBy_userRoles_id"
	}),
	gymRoutines_deletedBy: many(gymRoutine, {
		relationName: "gymRoutine_deletedBy_userRoles_id"
	}),
	gymSets_createdBy: many(gymSet, {
		relationName: "gymSet_createdBy_userRoles_id"
	}),
	gymSets_updatedBy: many(gymSet, {
		relationName: "gymSet_updatedBy_userRoles_id"
	}),
	gymSets_deletedBy: many(gymSet, {
		relationName: "gymSet_deletedBy_userRoles_id"
	}),
	gymPlans_createdBy: many(gymPlan, {
		relationName: "gymPlan_createdBy_userRoles_id"
	}),
	gymPlans_updatedBy: many(gymPlan, {
		relationName: "gymPlan_updatedBy_userRoles_id"
	}),
	gymPlans_deletedBy: many(gymPlan, {
		relationName: "gymPlan_deletedBy_userRoles_id"
	}),
	foodIntakeCommentDays: many(foodIntakeCommentDay),
	foodIntakePhotoDays: many(foodIntakePhotoDay),
	foodIntakeStarRatingDays: many(foodIntakeStarRatingDay),
	gymExercises_createdBy: many(gymExercise, {
		relationName: "gymExercise_createdBy_userRoles_id"
	}),
	gymExercises_updatedBy: many(gymExercise, {
		relationName: "gymExercise_updatedBy_userRoles_id"
	}),
	gymExercises_deletedBy: many(gymExercise, {
		relationName: "gymExercise_deletedBy_userRoles_id"
	}),
	questionnaireQuestionsCategoryByUserRoles: many(questionnaireQuestionsCategoryByUserRole),
	documents: many(documents),
	folders: many(folders),
	teams: many(teams),
	userRolesLicenses: many(userRolesLicenses),
}));

export const externalCalendarRelations = relations(externalCalendar, ({one, many}) => ({
	appointments: many(appointment),
	userRole: one(userRoles, {
		fields: [externalCalendar.userRolesId],
		references: [userRoles.id]
	}),
}));

export const athleteRelations = relations(athlete, ({many}) => ({
	appointments: many(appointment),
	athleteByUserProfiles: many(athleteByUserProfile),
	athleteByUserProfileRoles: many(athleteByUserProfileRole),
	nutritionAssessments: many(nutritionAssessment),
	athleteSports: many(athleteSports),
	nutritionIntakesPlans: many(nutritionIntakesPlan),
	foodPlans: many(foodPlan),
	athleteSnapshots: many(athleteSnapshots),
	athleteMedicalStudies: many(athleteMedicalStudies),
	eventParticipants: many(eventParticipants),
	athleteDayActivities: many(athleteDayActivity),
	anthropometries: many(anthropometry),
	athletePhotos: many(athletePhotos),
	colleaguesAthleteColaborations: many(colleaguesAthleteColaboration),
	gymPlans: many(gymPlan),
	foodIntakeCommentDays: many(foodIntakeCommentDay),
	foodIntakePhotoDays: many(foodIntakePhotoDay),
	foodIntakeStarRatingDays: many(foodIntakeStarRatingDay),
	gymPlanRoutinePerformances: many(gymPlanRoutinePerformance),
	documentWhitelists: many(documentWhitelist),
	folderWhitelists: many(folderWhitelist),
	subgroupAthletes: many(subgroupAthletes),
	teamAthletes: many(teamAthletes),
	athleteBlacklists: many(athleteBlacklist),
}));

export const appointmentDurationRelations = relations(appointmentDuration, ({one, many}) => ({
	appointments: many(appointment),
	userRole: one(userRoles, {
		fields: [appointmentDuration.userRolesId],
		references: [userRoles.id]
	}),
}));

export const activityLevelValuesRelations = relations(activityLevelValues, ({one}) => ({
	activityLevel: one(activityLevel, {
		fields: [activityLevelValues.activityLevelId],
		references: [activityLevel.id]
	}),
}));

export const activityLevelRelations = relations(activityLevel, ({many}) => ({
	activityLevelValues: many(activityLevelValues),
}));

export const usersRelations = relations(users, ({many}) => ({
	userRoles: many(userRoles),
	athleteByUserProfiles: many(athleteByUserProfile),
	userAddresses: many(userAddress),
	userSocials: many(userSocial),
	userPreferences: many(userPreferences),
	refreshTokens: many(refreshTokens),
}));

export const roleTypesRelations = relations(roleTypes, ({many}) => ({
	userRoles: many(userRoles),
}));

export const athleteByUserProfileRelations = relations(athleteByUserProfile, ({one}) => ({
	athlete: one(athlete, {
		fields: [athleteByUserProfile.athleteId],
		references: [athlete.id]
	}),
	user: one(users, {
		fields: [athleteByUserProfile.userId],
		references: [users.id]
	}),
}));

export const athleteByUserProfileRoleRelations = relations(athleteByUserProfileRole, ({one}) => ({
	athlete: one(athlete, {
		fields: [athleteByUserProfileRole.athleteId],
		references: [athlete.id]
	}),
	userRole: one(userRoles, {
		fields: [athleteByUserProfileRole.userRolesId],
		references: [userRoles.id]
	}),
}));

export const nutritionAssessmentRelations = relations(nutritionAssessment, ({one, many}) => ({
	athlete: one(athlete, {
		fields: [nutritionAssessment.athleteId],
		references: [athlete.id]
	}),
	userRole: one(userRoles, {
		fields: [nutritionAssessment.userRolesId],
		references: [userRoles.id]
	}),
	nutritionAssessmentAnswers: many(nutritionAssessmentAnswer),
	nutritionAssessmentNotesByCategories: many(nutritionAssessmentNotesByCategory),
	nutritionAssessmentMedicalStudies: many(nutritionAssessmentMedicalStudies),
	athleteDayActivities: many(athleteDayActivity),
	anthropometries: many(anthropometry),
	nutritionAssessmentPhotos: many(nutritionAssessmentPhotos),
	nutritionAssessmentReports: many(nutritionAssessmentReport),
}));

export const athleteSportsRelations = relations(athleteSports, ({one}) => ({
	athlete: one(athlete, {
		fields: [athleteSports.athleteId],
		references: [athlete.id]
	}),
	sport: one(sports, {
		fields: [athleteSports.sportId],
		references: [sports.id]
	}),
}));

export const sportsRelations = relations(sports, ({many}) => ({
	athleteSports: many(athleteSports),
	events: many(events),
}));

export const availabilityRelations = relations(availability, ({one}) => ({
	userRole: one(userRoles, {
		fields: [availability.userRolesId],
		references: [userRoles.id]
	}),
}));

export const nutritionAssessmentAnswerRelations = relations(nutritionAssessmentAnswer, ({one}) => ({
	nutritionAssessment: one(nutritionAssessment, {
		fields: [nutritionAssessmentAnswer.nutritionAssessmentId],
		references: [nutritionAssessment.id]
	}),
	questionnaire: one(questionnaire, {
		fields: [nutritionAssessmentAnswer.questionnaireId],
		references: [questionnaire.id]
	}),
	questionnaireQuestion: one(questionnaireQuestion, {
		fields: [nutritionAssessmentAnswer.questionnaireQuestionId],
		references: [questionnaireQuestion.id]
	}),
}));

export const questionnaireRelations = relations(questionnaire, ({one, many}) => ({
	nutritionAssessmentAnswers: many(nutritionAssessmentAnswer),
	questionnaireType: one(questionnaireType, {
		fields: [questionnaire.questionnaireTypeId],
		references: [questionnaireType.id]
	}),
	userRole: one(userRoles, {
		fields: [questionnaire.userRolesId],
		references: [userRoles.id]
	}),
	questionnaireQuestions: many(questionnaireQuestion),
}));

export const questionnaireQuestionRelations = relations(questionnaireQuestion, ({one, many}) => ({
	nutritionAssessmentAnswers: many(nutritionAssessmentAnswer),
	questionnaireQuestionType: one(questionnaireQuestionType, {
		fields: [questionnaireQuestion.questionnaireQuestionTypeId],
		references: [questionnaireQuestionType.id]
	}),
	questionnaire: one(questionnaire, {
		fields: [questionnaireQuestion.questionnaireId],
		references: [questionnaire.id]
	}),
	questionnaireOptions: many(questionnaireOption),
	questionnaireQuestionByCategories: many(questionnaireQuestionByCategory),
}));

export const questionnaireTypeRelations = relations(questionnaireType, ({many}) => ({
	questionnaires: many(questionnaire),
}));

export const questionnaireQuestionTypeRelations = relations(questionnaireQuestionType, ({many}) => ({
	questionnaireQuestions: many(questionnaireQuestion),
}));

export const nutritionAssessmentNotesByCategoryRelations = relations(nutritionAssessmentNotesByCategory, ({one}) => ({
	nutritionAssessment: one(nutritionAssessment, {
		fields: [nutritionAssessmentNotesByCategory.nutritionAssessmentId],
		references: [nutritionAssessment.id]
	}),
	questionnaireQuestionsCategory: one(questionnaireQuestionsCategory, {
		fields: [nutritionAssessmentNotesByCategory.questionnaireQuestionCategoryId],
		references: [questionnaireQuestionsCategory.id]
	}),
}));

export const questionnaireQuestionsCategoryRelations = relations(questionnaireQuestionsCategory, ({many}) => ({
	nutritionAssessmentNotesByCategories: many(nutritionAssessmentNotesByCategory),
	questionnaireQuestionByCategories: many(questionnaireQuestionByCategory),
	questionnaireQuestionsCategoryByUserRoles: many(questionnaireQuestionsCategoryByUserRole),
}));

export const nutritionIntakesPlanRelations = relations(nutritionIntakesPlan, ({one, many}) => ({
	athlete: one(athlete, {
		fields: [nutritionIntakesPlan.athleteId],
		references: [athlete.id]
	}),
	userRole: one(userRoles, {
		fields: [nutritionIntakesPlan.userRolesId],
		references: [userRoles.id]
	}),
	nutritionIntakeDayPlans: many(nutritionIntakeDayPlan),
}));

export const nutritionIntakeDayPlanRelations = relations(nutritionIntakeDayPlan, ({one, many}) => ({
	nutritionIntakesPlan: one(nutritionIntakesPlan, {
		fields: [nutritionIntakeDayPlan.nutritionIntakesPlanId],
		references: [nutritionIntakesPlan.id]
	}),
	nutritionIntakes: many(nutritionIntakes),
}));

export const nutritionIntakesRelations = relations(nutritionIntakes, ({one}) => ({
	nutritionIntakeDayPlan: one(nutritionIntakeDayPlan, {
		fields: [nutritionIntakes.nutritionIntakeDayPlanId],
		references: [nutritionIntakeDayPlan.id]
	}),
	nutritionIntakesType: one(nutritionIntakesType, {
		fields: [nutritionIntakes.nutritionIntakesTypeId],
		references: [nutritionIntakesType.id]
	}),
}));

export const nutritionIntakesTypeRelations = relations(nutritionIntakesType, ({many}) => ({
	nutritionIntakes: many(nutritionIntakes),
}));

export const questionnaireOptionRelations = relations(questionnaireOption, ({one}) => ({
	questionnaireQuestion: one(questionnaireQuestion, {
		fields: [questionnaireOption.questionnaireQuestionId],
		references: [questionnaireQuestion.id]
	}),
}));

export const questionnaireQuestionByCategoryRelations = relations(questionnaireQuestionByCategory, ({one}) => ({
	questionnaireQuestion: one(questionnaireQuestion, {
		fields: [questionnaireQuestionByCategory.questionnaireQuestionId],
		references: [questionnaireQuestion.id]
	}),
	questionnaireQuestionsCategory: one(questionnaireQuestionsCategory, {
		fields: [questionnaireQuestionByCategory.questionnaireQuestionsCategoryId],
		references: [questionnaireQuestionsCategory.id]
	}),
}));

export const foodComponentRelations = relations(foodComponent, ({one}) => ({
	food: one(food, {
		fields: [foodComponent.foodId],
		references: [food.id]
	}),
	component: one(component, {
		fields: [foodComponent.componentId],
		references: [component.id]
	}),
}));

export const foodRelations = relations(food, ({one, many}) => ({
	foodComponents: many(foodComponent),
	foodEquivalenceDetails: many(foodEquivalenceDetail),
	foodBrand: one(foodBrand, {
		fields: [food.foodBrandId],
		references: [foodBrand.id]
	}),
	foodCategoryRelations: many(foodCategoryRelation),
	foodCombineds_foodId: many(foodCombined, {
		relationName: "foodCombined_foodId_food_id"
	}),
	foodCombineds_combinedFoodId: many(foodCombined, {
		relationName: "foodCombined_combinedFoodId_food_id"
	}),
}));

export const componentRelations = relations(component, ({many}) => ({
	foodComponents: many(foodComponent),
}));

export const foodEquivalenceDetailRelations = relations(foodEquivalenceDetail, ({one}) => ({
	food: one(food, {
		fields: [foodEquivalenceDetail.foodId],
		references: [food.id]
	}),
	foodEquivalence: one(foodEquivalence, {
		fields: [foodEquivalenceDetail.foodEquivalenceId],
		references: [foodEquivalence.id]
	}),
}));

export const foodEquivalenceRelations = relations(foodEquivalence, ({one, many}) => ({
	foodEquivalenceDetails: many(foodEquivalenceDetail),
	userRole: one(userRoles, {
		fields: [foodEquivalence.userRolesId],
		references: [userRoles.id]
	}),
	foodIntakeEquivalences: many(foodIntakeEquivalence),
}));

export const foodBrandRelations = relations(foodBrand, ({many}) => ({
	foods: many(food),
}));

export const userAddressRelations = relations(userAddress, ({one}) => ({
	user: one(users, {
		fields: [userAddress.userId],
		references: [users.id]
	}),
}));

export const foodIntakeEquivalenceRelations = relations(foodIntakeEquivalence, ({one}) => ({
	foodIntake: one(foodIntake, {
		fields: [foodIntakeEquivalence.foodIntakeId],
		references: [foodIntake.id]
	}),
	foodEquivalence: one(foodEquivalence, {
		fields: [foodIntakeEquivalence.foodEquivalenceId],
		references: [foodEquivalence.id]
	}),
}));

export const foodIntakeRelations = relations(foodIntake, ({one, many}) => ({
	foodIntakeEquivalences: many(foodIntakeEquivalence),
	foodPlan: one(foodPlan, {
		fields: [foodIntake.foodPlanId],
		references: [foodPlan.id]
	}),
	foodIntakeType: one(foodIntakeType, {
		fields: [foodIntake.foodIntakeTypeId],
		references: [foodIntakeType.id]
	}),
	foodIntakeCommentDays: many(foodIntakeCommentDay),
	foodIntakePhotoDays: many(foodIntakePhotoDay),
	foodIntakeStarRatingDays: many(foodIntakeStarRatingDay),
}));

export const foodPlanRelations = relations(foodPlan, ({one, many}) => ({
	foodIntakes: many(foodIntake),
	userRole: one(userRoles, {
		fields: [foodPlan.userRolesId],
		references: [userRoles.id]
	}),
	athlete: one(athlete, {
		fields: [foodPlan.athleteId],
		references: [athlete.id]
	}),
	foodPlanDocuments: many(foodPlanDocument),
}));

export const foodIntakeTypeRelations = relations(foodIntakeType, ({many}) => ({
	foodIntakes: many(foodIntake),
}));

export const athleteSnapshotsRelations = relations(athleteSnapshots, ({one}) => ({
	athlete: one(athlete, {
		fields: [athleteSnapshots.athleteId],
		references: [athlete.id]
	}),
}));

export const userSocialRelations = relations(userSocial, ({one}) => ({
	user: one(users, {
		fields: [userSocial.userId],
		references: [users.id]
	}),
}));

export const nutritionAssessmentMedicalStudiesRelations = relations(nutritionAssessmentMedicalStudies, ({one}) => ({
	nutritionAssessment: one(nutritionAssessment, {
		fields: [nutritionAssessmentMedicalStudies.nutritionAssessmentId],
		references: [nutritionAssessment.id]
	}),
	athleteMedicalStudy: one(athleteMedicalStudies, {
		fields: [nutritionAssessmentMedicalStudies.athleteMedicalStudyId],
		references: [athleteMedicalStudies.id]
	}),
}));

export const athleteMedicalStudiesRelations = relations(athleteMedicalStudies, ({one, many}) => ({
	nutritionAssessmentMedicalStudies: many(nutritionAssessmentMedicalStudies),
	athlete: one(athlete, {
		fields: [athleteMedicalStudies.athleteId],
		references: [athlete.id]
	}),
}));

export const conversationStatusRelations = relations(conversationStatus, ({one}) => ({
	conversation: one(conversations, {
		fields: [conversationStatus.conversationId],
		references: [conversations.id]
	}),
	userRole: one(userRoles, {
		fields: [conversationStatus.userId],
		references: [userRoles.id]
	}),
	message: one(messages, {
		fields: [conversationStatus.lastReadMessageId],
		references: [messages.id]
	}),
}));

export const conversationsRelations = relations(conversations, ({one, many}) => ({
	conversationStatuses: many(conversationStatus),
	messages: many(messages),
	userRole: one(userRoles, {
		fields: [conversations.createdBy],
		references: [userRoles.id]
	}),
}));

export const messagesRelations = relations(messages, ({one, many}) => ({
	conversationStatuses: many(conversationStatus),
	conversation: one(conversations, {
		fields: [messages.conversationId],
		references: [conversations.id]
	}),
	userRole: one(userRoles, {
		fields: [messages.senderId],
		references: [userRoles.id]
	}),
	mentionNotifications: many(mentionNotifications),
}));

export const mentionNotificationsRelations = relations(mentionNotifications, ({one}) => ({
	userRole: one(userRoles, {
		fields: [mentionNotifications.userId],
		references: [userRoles.id]
	}),
	message: one(messages, {
		fields: [mentionNotifications.messageId],
		references: [messages.id]
	}),
}));

export const eventsRelations = relations(events, ({one, many}) => ({
	sport: one(sports, {
		fields: [events.sportId],
		references: [sports.id]
	}),
	userRole_createdBy: one(userRoles, {
		fields: [events.createdBy],
		references: [userRoles.id],
		relationName: "events_createdBy_userRoles_id"
	}),
	userRole_updatedBy: one(userRoles, {
		fields: [events.updatedBy],
		references: [userRoles.id],
		relationName: "events_updatedBy_userRoles_id"
	}),
	eventParticipants: many(eventParticipants),
}));

export const eventParticipantsRelations = relations(eventParticipants, ({one}) => ({
	event: one(events, {
		fields: [eventParticipants.eventId],
		references: [events.id]
	}),
	athlete: one(athlete, {
		fields: [eventParticipants.athleteId],
		references: [athlete.id]
	}),
	userRole_createdBy: one(userRoles, {
		fields: [eventParticipants.createdBy],
		references: [userRoles.id],
		relationName: "eventParticipants_createdBy_userRoles_id"
	}),
	userRole_updatedBy: one(userRoles, {
		fields: [eventParticipants.updatedBy],
		references: [userRoles.id],
		relationName: "eventParticipants_updatedBy_userRoles_id"
	}),
}));

export const athleteDayActivityRelations = relations(athleteDayActivity, ({one}) => ({
	athlete: one(athlete, {
		fields: [athleteDayActivity.athleteId],
		references: [athlete.id]
	}),
	userRole: one(userRoles, {
		fields: [athleteDayActivity.userRolesId],
		references: [userRoles.id]
	}),
	nutritionAssessment: one(nutritionAssessment, {
		fields: [athleteDayActivity.nutritionAssessmentId],
		references: [nutritionAssessment.id]
	}),
}));

export const anthropometryRelations = relations(anthropometry, ({one}) => ({
	athlete: one(athlete, {
		fields: [anthropometry.athleteId],
		references: [athlete.id]
	}),
	userRole: one(userRoles, {
		fields: [anthropometry.userRolesId],
		references: [userRoles.id]
	}),
	nutritionAssessment: one(nutritionAssessment, {
		fields: [anthropometry.nutritionAssessmentId],
		references: [nutritionAssessment.id]
	}),
}));

export const athletePhotosRelations = relations(athletePhotos, ({one, many}) => ({
	athlete: one(athlete, {
		fields: [athletePhotos.athleteId],
		references: [athlete.id]
	}),
	nutritionAssessmentPhotos: many(nutritionAssessmentPhotos),
}));

export const nutritionAssessmentPhotosRelations = relations(nutritionAssessmentPhotos, ({one}) => ({
	nutritionAssessment: one(nutritionAssessment, {
		fields: [nutritionAssessmentPhotos.assessmentId],
		references: [nutritionAssessment.id]
	}),
	athletePhoto: one(athletePhotos, {
		fields: [nutritionAssessmentPhotos.photoId],
		references: [athletePhotos.id]
	}),
}));

export const foodCategoryRelationRelations = relations(foodCategoryRelation, ({one}) => ({
	food: one(food, {
		fields: [foodCategoryRelation.foodId],
		references: [food.id]
	}),
	foodCategory: one(foodCategory, {
		fields: [foodCategoryRelation.foodCategoryId],
		references: [foodCategory.id]
	}),
}));

export const foodCategoryRelations = relations(foodCategory, ({many}) => ({
	foodCategoryRelations: many(foodCategoryRelation),
}));

export const gymExerciseMediaRelations = relations(gymExerciseMedia, ({one}) => ({
	gymExercise: one(gymExercise, {
		fields: [gymExerciseMedia.exerciseId],
		references: [gymExercise.id]
	}),
}));

export const gymExerciseRelations = relations(gymExercise, ({one, many}) => ({
	gymExerciseMedias: many(gymExerciseMedia),
	gymExerciseCategoryExercises: many(gymExerciseCategoryExercises),
	gymSetExercises: many(gymSetExercise),
	userRole_createdBy: one(userRoles, {
		fields: [gymExercise.createdBy],
		references: [userRoles.id],
		relationName: "gymExercise_createdBy_userRoles_id"
	}),
	userRole_updatedBy: one(userRoles, {
		fields: [gymExercise.updatedBy],
		references: [userRoles.id],
		relationName: "gymExercise_updatedBy_userRoles_id"
	}),
	userRole_deletedBy: one(userRoles, {
		fields: [gymExercise.deletedBy],
		references: [userRoles.id],
		relationName: "gymExercise_deletedBy_userRoles_id"
	}),
}));

export const gymRoutineStageRelations = relations(gymRoutineStage, ({one}) => ({
	gymRoutine: one(gymRoutine, {
		fields: [gymRoutineStage.routineId],
		references: [gymRoutine.id]
	}),
	gymStage: one(gymStage, {
		fields: [gymRoutineStage.stageId],
		references: [gymStage.id]
	}),
}));

export const gymRoutineRelations = relations(gymRoutine, ({one, many}) => ({
	gymRoutineStages: many(gymRoutineStage),
	userRole_createdBy: one(userRoles, {
		fields: [gymRoutine.createdBy],
		references: [userRoles.id],
		relationName: "gymRoutine_createdBy_userRoles_id"
	}),
	userRole_updatedBy: one(userRoles, {
		fields: [gymRoutine.updatedBy],
		references: [userRoles.id],
		relationName: "gymRoutine_updatedBy_userRoles_id"
	}),
	userRole_deletedBy: one(userRoles, {
		fields: [gymRoutine.deletedBy],
		references: [userRoles.id],
		relationName: "gymRoutine_deletedBy_userRoles_id"
	}),
	gymPlanRoutines: many(gymPlanRoutine),
}));

export const gymStageRelations = relations(gymStage, ({one, many}) => ({
	gymRoutineStages: many(gymRoutineStage),
	gymStageSets: many(gymStageSet),
	userRole_createdBy: one(userRoles, {
		fields: [gymStage.createdBy],
		references: [userRoles.id],
		relationName: "gymStage_createdBy_userRoles_id"
	}),
	userRole_updatedBy: one(userRoles, {
		fields: [gymStage.updatedBy],
		references: [userRoles.id],
		relationName: "gymStage_updatedBy_userRoles_id"
	}),
	userRole_deletedBy: one(userRoles, {
		fields: [gymStage.deletedBy],
		references: [userRoles.id],
		relationName: "gymStage_deletedBy_userRoles_id"
	}),
}));

export const gymSetExerciseWeightRelations = relations(gymSetExerciseWeight, ({one}) => ({
	gymSetExercise: one(gymSetExercise, {
		fields: [gymSetExerciseWeight.setExerciseId],
		references: [gymSetExercise.id]
	}),
	gymWeight: one(gymWeight, {
		fields: [gymSetExerciseWeight.weightId],
		references: [gymWeight.id]
	}),
}));

export const gymSetExerciseRelations = relations(gymSetExercise, ({one, many}) => ({
	gymSetExerciseWeights: many(gymSetExerciseWeight),
	gymSet: one(gymSet, {
		fields: [gymSetExercise.setId],
		references: [gymSet.id]
	}),
	gymExercise: one(gymExercise, {
		fields: [gymSetExercise.exerciseId],
		references: [gymExercise.id]
	}),
}));

export const gymWeightRelations = relations(gymWeight, ({many}) => ({
	gymSetExerciseWeights: many(gymSetExerciseWeight),
}));

export const gymStageSetRelations = relations(gymStageSet, ({one}) => ({
	gymStage: one(gymStage, {
		fields: [gymStageSet.stageId],
		references: [gymStage.id]
	}),
	gymSet: one(gymSet, {
		fields: [gymStageSet.setId],
		references: [gymSet.id]
	}),
}));

export const gymSetRelations = relations(gymSet, ({one, many}) => ({
	gymStageSets: many(gymStageSet),
	userRole_createdBy: one(userRoles, {
		fields: [gymSet.createdBy],
		references: [userRoles.id],
		relationName: "gymSet_createdBy_userRoles_id"
	}),
	userRole_updatedBy: one(userRoles, {
		fields: [gymSet.updatedBy],
		references: [userRoles.id],
		relationName: "gymSet_updatedBy_userRoles_id"
	}),
	userRole_deletedBy: one(userRoles, {
		fields: [gymSet.deletedBy],
		references: [userRoles.id],
		relationName: "gymSet_deletedBy_userRoles_id"
	}),
	gymSetExercises: many(gymSetExercise),
}));

export const colleaguesRelations = relations(colleagues, ({one, many}) => ({
	userRole_userRolesId: one(userRoles, {
		fields: [colleagues.userRolesId],
		references: [userRoles.id],
		relationName: "colleagues_userRolesId_userRoles_id"
	}),
	userRole_colleagueId: one(userRoles, {
		fields: [colleagues.colleagueId],
		references: [userRoles.id],
		relationName: "colleagues_colleagueId_userRoles_id"
	}),
	userRole_createdBy: one(userRoles, {
		fields: [colleagues.createdBy],
		references: [userRoles.id],
		relationName: "colleagues_createdBy_userRoles_id"
	}),
	userRole_updatedBy: one(userRoles, {
		fields: [colleagues.updatedBy],
		references: [userRoles.id],
		relationName: "colleagues_updatedBy_userRoles_id"
	}),
	colleaguesAthleteColaborations: many(colleaguesAthleteColaboration),
}));

export const colleaguesAthleteColaborationRelations = relations(colleaguesAthleteColaboration, ({one}) => ({
	colleague: one(colleagues, {
		fields: [colleaguesAthleteColaboration.colleagueId],
		references: [colleagues.id]
	}),
	athlete: one(athlete, {
		fields: [colleaguesAthleteColaboration.athleteId],
		references: [athlete.id]
	}),
	userRole_createdBy: one(userRoles, {
		fields: [colleaguesAthleteColaboration.createdBy],
		references: [userRoles.id],
		relationName: "colleaguesAthleteColaboration_createdBy_userRoles_id"
	}),
	userRole_updatedBy: one(userRoles, {
		fields: [colleaguesAthleteColaboration.updatedBy],
		references: [userRoles.id],
		relationName: "colleaguesAthleteColaboration_updatedBy_userRoles_id"
	}),
}));

export const foodCombinedRelations = relations(foodCombined, ({one}) => ({
	food_foodId: one(food, {
		fields: [foodCombined.foodId],
		references: [food.id],
		relationName: "foodCombined_foodId_food_id"
	}),
	food_combinedFoodId: one(food, {
		fields: [foodCombined.combinedFoodId],
		references: [food.id],
		relationName: "foodCombined_combinedFoodId_food_id"
	}),
}));

export const nutritionAssessmentReportRelations = relations(nutritionAssessmentReport, ({one, many}) => ({
	nutritionAssessment: one(nutritionAssessment, {
		fields: [nutritionAssessmentReport.nutritionAssessmentId],
		references: [nutritionAssessment.id]
	}),
	nutritionAssessmentReportComments: many(nutritionAssessmentReportComment),
}));

export const nutritionAssessmentReportCommentRelations = relations(nutritionAssessmentReportComment, ({one}) => ({
	nutritionAssessmentReport: one(nutritionAssessmentReport, {
		fields: [nutritionAssessmentReportComment.nutritionAssessmentReportId],
		references: [nutritionAssessmentReport.id]
	}),
}));

export const gymExerciseCategoryExercisesRelations = relations(gymExerciseCategoryExercises, ({one}) => ({
	gymExerciseCategory: one(gymExerciseCategory, {
		fields: [gymExerciseCategoryExercises.categoryId],
		references: [gymExerciseCategory.id]
	}),
	gymExercise: one(gymExercise, {
		fields: [gymExerciseCategoryExercises.exerciseId],
		references: [gymExercise.id]
	}),
}));

export const gymExerciseCategoryRelations = relations(gymExerciseCategory, ({many}) => ({
	gymExerciseCategoryExercises: many(gymExerciseCategoryExercises),
}));

export const gymPlanRelations = relations(gymPlan, ({one, many}) => ({
	athlete: one(athlete, {
		fields: [gymPlan.athleteId],
		references: [athlete.id]
	}),
	userRole_createdBy: one(userRoles, {
		fields: [gymPlan.createdBy],
		references: [userRoles.id],
		relationName: "gymPlan_createdBy_userRoles_id"
	}),
	userRole_updatedBy: one(userRoles, {
		fields: [gymPlan.updatedBy],
		references: [userRoles.id],
		relationName: "gymPlan_updatedBy_userRoles_id"
	}),
	userRole_deletedBy: one(userRoles, {
		fields: [gymPlan.deletedBy],
		references: [userRoles.id],
		relationName: "gymPlan_deletedBy_userRoles_id"
	}),
	gymPlanRoutines: many(gymPlanRoutine),
}));

export const foodIntakeCommentDayRelations = relations(foodIntakeCommentDay, ({one}) => ({
	foodIntake: one(foodIntake, {
		fields: [foodIntakeCommentDay.foodIntakeId],
		references: [foodIntake.id]
	}),
	athlete: one(athlete, {
		fields: [foodIntakeCommentDay.athleteId],
		references: [athlete.id]
	}),
	userRole: one(userRoles, {
		fields: [foodIntakeCommentDay.userRolesId],
		references: [userRoles.id]
	}),
}));

export const foodIntakePhotoDayRelations = relations(foodIntakePhotoDay, ({one}) => ({
	foodIntake: one(foodIntake, {
		fields: [foodIntakePhotoDay.foodIntakeId],
		references: [foodIntake.id]
	}),
	athlete: one(athlete, {
		fields: [foodIntakePhotoDay.athleteId],
		references: [athlete.id]
	}),
	userRole: one(userRoles, {
		fields: [foodIntakePhotoDay.userRolesId],
		references: [userRoles.id]
	}),
}));

export const foodIntakeStarRatingDayRelations = relations(foodIntakeStarRatingDay, ({one}) => ({
	foodIntake: one(foodIntake, {
		fields: [foodIntakeStarRatingDay.foodIntakeId],
		references: [foodIntake.id]
	}),
	athlete: one(athlete, {
		fields: [foodIntakeStarRatingDay.athleteId],
		references: [athlete.id]
	}),
	userRole: one(userRoles, {
		fields: [foodIntakeStarRatingDay.userRolesId],
		references: [userRoles.id]
	}),
}));

export const gymPlanRoutineRelations = relations(gymPlanRoutine, ({one, many}) => ({
	gymPlan: one(gymPlan, {
		fields: [gymPlanRoutine.planId],
		references: [gymPlan.id]
	}),
	gymRoutine: one(gymRoutine, {
		fields: [gymPlanRoutine.routineId],
		references: [gymRoutine.id]
	}),
	gymPlanRoutinePerformances: many(gymPlanRoutinePerformance),
}));

export const gymPlanRoutinePerformanceRelations = relations(gymPlanRoutinePerformance, ({one}) => ({
	gymPlanRoutine: one(gymPlanRoutine, {
		fields: [gymPlanRoutinePerformance.planRoutineId],
		references: [gymPlanRoutine.id]
	}),
	athlete: one(athlete, {
		fields: [gymPlanRoutinePerformance.athleteId],
		references: [athlete.id]
	}),
}));

export const questionnaireQuestionsCategoryByUserRoleRelations = relations(questionnaireQuestionsCategoryByUserRole, ({one}) => ({
	questionnaireQuestionsCategory: one(questionnaireQuestionsCategory, {
		fields: [questionnaireQuestionsCategoryByUserRole.questionnaireQuestionsCategoryId],
		references: [questionnaireQuestionsCategory.id]
	}),
	userRole: one(userRoles, {
		fields: [questionnaireQuestionsCategoryByUserRole.userRoleId],
		references: [userRoles.id]
	}),
}));

export const userPreferencesRelations = relations(userPreferences, ({one}) => ({
	user: one(users, {
		fields: [userPreferences.userId],
		references: [users.id]
	}),
}));

export const refreshTokensRelations = relations(refreshTokens, ({one}) => ({
	user: one(users, {
		fields: [refreshTokens.userId],
		references: [users.id]
	}),
}));

export const documentsRelations = relations(documents, ({one, many}) => ({
	folder: one(folders, {
		fields: [documents.folderId],
		references: [folders.id]
	}),
	userRole: one(userRoles, {
		fields: [documents.uploadedById],
		references: [userRoles.id]
	}),
	documentPermissions: many(documentPermissions),
	documentWhitelists: many(documentWhitelist),
}));

export const foldersRelations = relations(folders, ({one, many}) => ({
	documents: many(documents),
	userRole: one(userRoles, {
		fields: [folders.ownerCoachId],
		references: [userRoles.id]
	}),
	folderPermissions: many(folderPermissions),
	folderWhitelists: many(folderWhitelist),
}));

export const documentPermissionsRelations = relations(documentPermissions, ({one}) => ({
	document: one(documents, {
		fields: [documentPermissions.documentId],
		references: [documents.id]
	}),
}));

export const folderPermissionsRelations = relations(folderPermissions, ({one}) => ({
	folder: one(folders, {
		fields: [folderPermissions.folderId],
		references: [folders.id]
	}),
}));

export const foodPlanDocumentRelations = relations(foodPlanDocument, ({one}) => ({
	foodPlan: one(foodPlan, {
		fields: [foodPlanDocument.foodPlanId],
		references: [foodPlan.id]
	}),
}));

export const subgroupsRelations = relations(subgroups, ({one, many}) => ({
	team: one(teams, {
		fields: [subgroups.teamId],
		references: [teams.id]
	}),
	subgroup: one(subgroups, {
		fields: [subgroups.parentId],
		references: [subgroups.id],
		relationName: "subgroups_parentId_subgroups_id"
	}),
	subgroups: many(subgroups, {
		relationName: "subgroups_parentId_subgroups_id"
	}),
	subgroupAthletes: many(subgroupAthletes),
}));

export const teamsRelations = relations(teams, ({one, many}) => ({
	subgroups: many(subgroups),
	userRole: one(userRoles, {
		fields: [teams.userRolesId],
		references: [userRoles.id]
	}),
	teamAthletes: many(teamAthletes),
}));

export const userRolesLicensesRelations = relations(userRolesLicenses, ({one}) => ({
	userRole: one(userRoles, {
		fields: [userRolesLicenses.userRoleId],
		references: [userRoles.id]
	}),
}));

export const documentWhitelistRelations = relations(documentWhitelist, ({one}) => ({
	document: one(documents, {
		fields: [documentWhitelist.documentId],
		references: [documents.id]
	}),
	athlete: one(athlete, {
		fields: [documentWhitelist.athleteId],
		references: [athlete.id]
	}),
}));

export const folderWhitelistRelations = relations(folderWhitelist, ({one}) => ({
	folder: one(folders, {
		fields: [folderWhitelist.folderId],
		references: [folders.id]
	}),
	athlete: one(athlete, {
		fields: [folderWhitelist.athleteId],
		references: [athlete.id]
	}),
}));

export const subgroupAthletesRelations = relations(subgroupAthletes, ({one}) => ({
	subgroup: one(subgroups, {
		fields: [subgroupAthletes.subgroupId],
		references: [subgroups.id]
	}),
	athlete: one(athlete, {
		fields: [subgroupAthletes.athleteId],
		references: [athlete.id]
	}),
}));

export const teamAthletesRelations = relations(teamAthletes, ({one}) => ({
	team: one(teams, {
		fields: [teamAthletes.teamId],
		references: [teams.id]
	}),
	athlete: one(athlete, {
		fields: [teamAthletes.athleteId],
		references: [athlete.id]
	}),
}));

export const athleteBlacklistRelations = relations(athleteBlacklist, ({one}) => ({
	athlete: one(athlete, {
		fields: [athleteBlacklist.athleteId],
		references: [athlete.id]
	}),
}));