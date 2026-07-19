-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    PRIMARY KEY ("roleId", "permissionId"),
    CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "authSubject" TEXT,
    "status" TEXT NOT NULL DEFAULT 'INVITED',
    "avatarUrl" TEXT,
    "lastLoginAt" DATETIME,
    "roleId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Employee_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "displayName" TEXT NOT NULL,
    "legalNameEncrypted" TEXT,
    "phoneEncrypted" TEXT,
    "emailEncrypted" TEXT,
    "wechatEncrypted" TEXT,
    "sensitivityLevel" INTEGER NOT NULL DEFAULT 1,
    "city" TEXT,
    "industryRole" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'INTAKE',
    "currentStage" TEXT NOT NULL,
    "nextMilestone" TEXT,
    "nextMilestoneAt" DATETIME,
    "clientId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Project_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectMember" (
    "projectId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CONTRIBUTOR',
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("projectId", "employeeId"),
    CONSTRAINT "ProjectMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProjectMember_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CreatorVoiceProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "professionalLevel" INTEGER NOT NULL DEFAULT 50,
    "humorLevel" INTEGER NOT NULL DEFAULT 50,
    "emotionalIntensity" INTEGER NOT NULL DEFAULT 50,
    "colloquialLevel" INTEGER NOT NULL DEFAULT 50,
    "sentenceLengthPreference" TEXT NOT NULL,
    "rhythmStyle" TEXT NOT NULL,
    "commonWords" TEXT NOT NULL,
    "bannedWords" TEXT NOT NULL,
    "catchphrases" TEXT NOT NULL,
    "openingStyle" TEXT NOT NULL,
    "endingStyle" TEXT NOT NULL,
    "controversyTolerance" INTEGER NOT NULL DEFAULT 30,
    "salesIntensity" INTEGER NOT NULL DEFAULT 40,
    "employeeNotes" TEXT,
    "approvedAt" DATETIME,
    "approvedById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CreatorVoiceProfile_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CreatorVoiceProfile_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VoiceSample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "voiceProfileId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sourceNote" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VoiceSample_voiceProfileId_fkey" FOREIGN KEY ("voiceProfileId") REFERENCES "CreatorVoiceProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "breed" TEXT,
    "birthDate" DATETIME,
    "appearance" TEXT,
    "personality" TEXT,
    "behavior" TEXT,
    "specialStories" TEXT,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Pet_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PetPersona" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "roleName" TEXT NOT NULL,
    "oneSentenceRole" TEXT NOT NULL,
    "personalityTags" TEXT NOT NULL,
    "coreMemoryPoint" TEXT NOT NULL,
    "mainContentFunction" TEXT NOT NULL,
    "suitableScenes" TEXT NOT NULL,
    "unsuitableTraits" TEXT NOT NULL,
    "cameraSuitability" INTEGER NOT NULL,
    "contentSuitability" INTEGER NOT NULL,
    "liveSuitability" INTEGER NOT NULL,
    "storyPotential" INTEGER NOT NULL,
    "relationshipModel" TEXT NOT NULL,
    "emotionalValue" TEXT NOT NULL,
    "recurringConflict" TEXT,
    "recurringStory" TEXT NOT NULL,
    "audienceConnection" TEXT NOT NULL,
    "expectedChange" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PetPersona_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PetPersona_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AudienceSegment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ageRange" TEXT,
    "cities" TEXT,
    "spendingPower" TEXT,
    "petOwnershipStage" TEXT,
    "lifestyle" TEXT,
    "painPoints" TEXT NOT NULL,
    "emotionalNeeds" TEXT,
    "contentNeeds" TEXT,
    "purchaseScenarios" TEXT,
    "decisionBarriers" TEXT,
    "categories" TEXT,
    "willingnessToPay" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AudienceSegment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PositioningSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "generatedById" TEXT NOT NULL,
    "diagnosisNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PositioningSession_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PositioningSession_generatedById_fkey" FOREIGN KEY ("generatedById") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PositioningOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "positioningSessionId" TEXT NOT NULL,
    "optionType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'GENERATED',
    "oneSentencePositioning" TEXT NOT NULL,
    "creatorPersona" TEXT NOT NULL,
    "petPersona" TEXT NOT NULL,
    "relationshipModel" TEXT NOT NULL,
    "coreAudience" TEXT NOT NULL,
    "audienceValue" TEXT NOT NULL,
    "platformStrategy" TEXT NOT NULL,
    "monetizationStrategy" TEXT NOT NULL,
    "liveCommerceFit" INTEGER NOT NULL,
    "executionDifficulty" INTEGER NOT NULL,
    "advantages" TEXT NOT NULL,
    "disadvantages" TEXT NOT NULL,
    "risks" TEXT NOT NULL,
    "recommendationScore" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PositioningOption_positioningSessionId_fkey" FOREIGN KEY ("positioningSessionId") REFERENCES "PositioningSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PositioningScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "positioningOptionId" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "dimension" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "evidence" TEXT NOT NULL,
    "riskNote" TEXT,
    CONSTRAINT "PositioningScore_positioningOptionId_fkey" FOREIGN KEY ("positioningOptionId") REFERENCES "PositioningOption" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContentPillar" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "positioningOptionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ratio" INTEGER NOT NULL,
    "suitableFormats" TEXT NOT NULL,
    "unsuitableFormats" TEXT,
    "productionDifficulty" INTEGER NOT NULL,
    CONSTRAINT "ContentPillar_positioningOptionId_fkey" FOREIGN KEY ("positioningOptionId") REFERENCES "PositioningOption" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PositioningReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "selectedOptionId" TEXT,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdById" TEXT NOT NULL,
    "lastEditedById" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" DATETIME,
    "approvedById" TEXT,
    "approvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PositioningReport_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PositioningReport_selectedOptionId_fkey" FOREIGN KEY ("selectedOptionId") REFERENCES "PositioningOption" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PositioningReport_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PositioningReport_lastEditedById_fkey" FOREIGN KEY ("lastEditedById") REFERENCES "Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PositioningReport_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PositioningReport_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PositioningReportVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "snapshot" JSONB NOT NULL,
    "changeNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PositioningReportVersion_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "PositioningReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContentPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "periodStart" DATETIME NOT NULL,
    "periodEnd" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ContentPlan_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ContentPlan_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContentPlanItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contentPlanId" TEXT NOT NULL,
    "contentPillarId" TEXT,
    "title" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "plannedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContentPlanItem_contentPlanId_fkey" FOREIGN KEY ("contentPlanId") REFERENCES "ContentPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ContentPlanItem_contentPillarId_fkey" FOREIGN KEY ("contentPillarId") REFERENCES "ContentPillar" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContentDraft" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "contentPlanItemId" TEXT,
    "title" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "currentBody" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ContentDraft_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ContentDraft_contentPlanItemId_fkey" FOREIGN KEY ("contentPlanItemId") REFERENCES "ContentPlanItem" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ContentDraft_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContentRevision" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contentDraftId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "changeNote" TEXT,
    "editedById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContentRevision_contentDraftId_fkey" FOREIGN KEY ("contentDraftId") REFERENCES "ContentDraft" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ContentRevision_editedById_fkey" FOREIGN KEY ("editedById") REFERENCES "Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AIStyleReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contentDraftId" TEXT NOT NULL,
    "contentRevisionId" TEXT,
    "genericPhraseScore" INTEGER NOT NULL,
    "personaConsistencyScore" INTEGER NOT NULL,
    "spokenNaturalnessScore" INTEGER NOT NULL,
    "detailDensityScore" INTEGER NOT NULL,
    "repetitionScore" INTEGER NOT NULL,
    "salesPressureScore" INTEGER NOT NULL,
    "detectedProblems" JSONB NOT NULL,
    "rewriteSuggestions" JSONB NOT NULL,
    "reviewedById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AIStyleReview_contentDraftId_fkey" FOREIGN KEY ("contentDraftId") REFERENCES "ContentDraft" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AIStyleReview_contentRevisionId_fkey" FOREIGN KEY ("contentRevisionId") REFERENCES "ContentRevision" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AIStyleReview_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "role" TEXT NOT NULL,
    "suitablePets" TEXT NOT NULL,
    "useScenario" TEXT NOT NULL,
    "coreSellingPoints" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "grossMarginRate" REAL,
    "commissionRate" REAL,
    "inventory" INTEGER,
    "afterSalesRisk" INTEGER NOT NULL,
    "returnRisk" INTEGER NOT NULL,
    "contentDisplayDifficulty" INTEGER NOT NULL,
    "liveExplanationDifficulty" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductFitAssessment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "ipFit" INTEGER NOT NULL,
    "audienceFit" INTEGER NOT NULL,
    "shortVideoFit" INTEGER NOT NULL,
    "liveFit" INTEGER NOT NULL,
    "displayDifficulty" INTEGER NOT NULL,
    "explanationDifficulty" INTEGER NOT NULL,
    "afterSalesRisk" INTEGER NOT NULL,
    "returnRisk" INTEGER NOT NULL,
    "grossMarginRate" REAL,
    "commissionRate" REAL,
    "recommendation" TEXT NOT NULL,
    "rationale" TEXT NOT NULL,
    "assessedById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductFitAssessment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductFitAssessment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductFitAssessment_assessedById_fkey" FOREIGN KEY ("assessedById") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LiveRoomProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "oneSentencePositioning" TEXT NOT NULL,
    "hostRole" TEXT NOT NULL,
    "petRole" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "coreScenario" TEXT NOT NULL,
    "retentionReason" TEXT NOT NULL,
    "trustReason" TEXT NOT NULL,
    "purchaseReason" TEXT NOT NULL,
    "productCategories" TEXT NOT NULL,
    "priceRange" TEXT NOT NULL,
    "hostStyle" TEXT NOT NULL,
    "visualStyle" TEXT NOT NULL,
    "liveRhythm" TEXT NOT NULL,
    "petAppearancePlan" TEXT NOT NULL,
    "salesIntensity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LiveRoomProfile_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LiveSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "liveRoomProfileId" TEXT,
    "title" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "scheduledAt" DATETIME,
    "startedAt" DATETIME,
    "endedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LiveSession_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LiveSession_liveRoomProfileId_fkey" FOREIGN KEY ("liveRoomProfileId") REFERENCES "LiveRoomProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LiveScript" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "liveRoomProfileId" TEXT,
    "liveSessionId" TEXT,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LiveScript_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LiveScript_liveRoomProfileId_fkey" FOREIGN KEY ("liveRoomProfileId") REFERENCES "LiveRoomProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "LiveScript_liveSessionId_fkey" FOREIGN KEY ("liveSessionId") REFERENCES "LiveSession" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "LiveScript_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LiveScriptBlock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "liveScriptId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "durationSec" INTEGER,
    "sortOrder" INTEGER NOT NULL,
    "productId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LiveScriptBlock_liveScriptId_fkey" FOREIGN KEY ("liveScriptId") REFERENCES "LiveScript" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LiveProduct" (
    "liveSessionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "targetUnits" INTEGER,

    PRIMARY KEY ("liveSessionId", "productId"),
    CONSTRAINT "LiveProduct_liveSessionId_fkey" FOREIGN KEY ("liveSessionId") REFERENCES "LiveSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LiveProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LiveMetric" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "liveSessionId" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "viewers" INTEGER NOT NULL,
    "averageConcurrentViewers" INTEGER NOT NULL,
    "peakConcurrentViewers" INTEGER NOT NULL,
    "entryRate" REAL,
    "averageWatchSeconds" INTEGER NOT NULL,
    "interactionRate" REAL NOT NULL,
    "productClickRate" REAL NOT NULL,
    "clickToOrderRate" REAL NOT NULL,
    "revenuePerThousandViews" REAL NOT NULL,
    "grossMerchandiseValue" REAL NOT NULL,
    "unitsSold" INTEGER NOT NULL,
    "averageOrderValue" REAL NOT NULL,
    "refundRate" REAL NOT NULL,
    "newFollowers" INTEGER NOT NULL,
    "followConversionRate" REAL NOT NULL,
    "productBreakdownSnapshot" JSONB,
    "timeSegmentSnapshot" JSONB,
    "scriptNodeSnapshot" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LiveMetric_liveSessionId_fkey" FOREIGN KEY ("liveSessionId") REFERENCES "LiveSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LiveReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "liveSessionId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "nextSessionRecommendations" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LiveReview_liveSessionId_fkey" FOREIGN KEY ("liveSessionId") REFERENCES "LiveSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LiveReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LiveReviewIssue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "liveReviewId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" INTEGER NOT NULL,
    "evidence" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    CONSTRAINT "LiveReviewIssue_liveReviewId_fkey" FOREIGN KEY ("liveReviewId") REFERENCES "LiveReview" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PromptVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "purpose" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "KnowledgeDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "KnowledgeReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "knowledgeDocumentId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "KnowledgeReview_knowledgeDocumentId_fkey" FOREIGN KEY ("knowledgeDocumentId") REFERENCES "KnowledgeDocument" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "KnowledgeReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actorId" TEXT NOT NULL,
    "projectId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "beforeSnapshot" JSONB,
    "afterSnapshot" JSONB,
    "ipAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AuditLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_code_key" ON "Role"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_code_key" ON "Permission"("code");

-- CreateIndex
CREATE INDEX "RolePermission_permissionId_idx" ON "RolePermission"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_authSubject_key" ON "Employee"("authSubject");

-- CreateIndex
CREATE INDEX "Employee_roleId_status_idx" ON "Employee"("roleId", "status");

-- CreateIndex
CREATE INDEX "Client_displayName_idx" ON "Client"("displayName");

-- CreateIndex
CREATE INDEX "Client_sensitivityLevel_idx" ON "Client"("sensitivityLevel");

-- CreateIndex
CREATE UNIQUE INDEX "Project_code_key" ON "Project"("code");

-- CreateIndex
CREATE INDEX "Project_clientId_status_idx" ON "Project"("clientId", "status");

-- CreateIndex
CREATE INDEX "Project_status_nextMilestoneAt_idx" ON "Project"("status", "nextMilestoneAt");

-- CreateIndex
CREATE INDEX "ProjectMember_employeeId_role_idx" ON "ProjectMember"("employeeId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorVoiceProfile_clientId_key" ON "CreatorVoiceProfile"("clientId");

-- CreateIndex
CREATE INDEX "CreatorVoiceProfile_approvedById_approvedAt_idx" ON "CreatorVoiceProfile"("approvedById", "approvedAt");

-- CreateIndex
CREATE INDEX "VoiceSample_voiceProfileId_type_isApproved_idx" ON "VoiceSample"("voiceProfileId", "type", "isApproved");

-- CreateIndex
CREATE INDEX "Pet_clientId_species_idx" ON "Pet"("clientId", "species");

-- CreateIndex
CREATE INDEX "PetPersona_projectId_liveSuitability_idx" ON "PetPersona"("projectId", "liveSuitability");

-- CreateIndex
CREATE UNIQUE INDEX "PetPersona_projectId_petId_key" ON "PetPersona"("projectId", "petId");

-- CreateIndex
CREATE INDEX "AudienceSegment_projectId_type_idx" ON "AudienceSegment"("projectId", "type");

-- CreateIndex
CREATE INDEX "PositioningSession_projectId_createdAt_idx" ON "PositioningSession"("projectId", "createdAt");

-- CreateIndex
CREATE INDEX "PositioningOption_status_recommendationScore_idx" ON "PositioningOption"("status", "recommendationScore");

-- CreateIndex
CREATE UNIQUE INDEX "PositioningOption_positioningSessionId_optionType_key" ON "PositioningOption"("positioningSessionId", "optionType");

-- CreateIndex
CREATE INDEX "PositioningScore_positioningOptionId_module_idx" ON "PositioningScore"("positioningOptionId", "module");

-- CreateIndex
CREATE INDEX "ContentPillar_positioningOptionId_type_idx" ON "ContentPillar"("positioningOptionId", "type");

-- CreateIndex
CREATE INDEX "PositioningReport_projectId_status_updatedAt_idx" ON "PositioningReport"("projectId", "status", "updatedAt");

-- CreateIndex
CREATE INDEX "PositioningReport_reviewedById_status_idx" ON "PositioningReport"("reviewedById", "status");

-- CreateIndex
CREATE UNIQUE INDEX "PositioningReportVersion_reportId_version_key" ON "PositioningReportVersion"("reportId", "version");

-- CreateIndex
CREATE INDEX "ContentPlan_projectId_periodStart_periodEnd_idx" ON "ContentPlan"("projectId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "ContentPlanItem_contentPlanId_plannedAt_idx" ON "ContentPlanItem"("contentPlanId", "plannedAt");

-- CreateIndex
CREATE INDEX "ContentPlanItem_contentPillarId_idx" ON "ContentPlanItem"("contentPillarId");

-- CreateIndex
CREATE INDEX "ContentDraft_projectId_status_updatedAt_idx" ON "ContentDraft"("projectId", "status", "updatedAt");

-- CreateIndex
CREATE INDEX "ContentDraft_contentPlanItemId_idx" ON "ContentDraft"("contentPlanItemId");

-- CreateIndex
CREATE INDEX "ContentRevision_editedById_createdAt_idx" ON "ContentRevision"("editedById", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ContentRevision_contentDraftId_version_key" ON "ContentRevision"("contentDraftId", "version");

-- CreateIndex
CREATE INDEX "AIStyleReview_contentDraftId_createdAt_idx" ON "AIStyleReview"("contentDraftId", "createdAt");

-- CreateIndex
CREATE INDEX "AIStyleReview_personaConsistencyScore_spokenNaturalnessScore_idx" ON "AIStyleReview"("personaConsistencyScore", "spokenNaturalnessScore");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_name_key" ON "ProductCategory"("name");

-- CreateIndex
CREATE INDEX "Product_projectId_role_active_idx" ON "Product"("projectId", "role", "active");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "ProductFitAssessment_projectId_recommendation_idx" ON "ProductFitAssessment"("projectId", "recommendation");

-- CreateIndex
CREATE INDEX "ProductFitAssessment_productId_createdAt_idx" ON "ProductFitAssessment"("productId", "createdAt");

-- CreateIndex
CREATE INDEX "LiveRoomProfile_projectId_status_idx" ON "LiveRoomProfile"("projectId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "LiveRoomProfile_projectId_version_key" ON "LiveRoomProfile"("projectId", "version");

-- CreateIndex
CREATE INDEX "LiveSession_projectId_status_scheduledAt_idx" ON "LiveSession"("projectId", "status", "scheduledAt");

-- CreateIndex
CREATE INDEX "LiveScript_projectId_status_idx" ON "LiveScript"("projectId", "status");

-- CreateIndex
CREATE INDEX "LiveScript_liveSessionId_idx" ON "LiveScript"("liveSessionId");

-- CreateIndex
CREATE INDEX "LiveScriptBlock_liveScriptId_type_idx" ON "LiveScriptBlock"("liveScriptId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "LiveScriptBlock_liveScriptId_sortOrder_key" ON "LiveScriptBlock"("liveScriptId", "sortOrder");

-- CreateIndex
CREATE INDEX "LiveProduct_productId_idx" ON "LiveProduct"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "LiveMetric_liveSessionId_key" ON "LiveMetric"("liveSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "LiveReview_liveSessionId_key" ON "LiveReview"("liveSessionId");

-- CreateIndex
CREATE INDEX "LiveReview_reviewerId_createdAt_idx" ON "LiveReview"("reviewerId", "createdAt");

-- CreateIndex
CREATE INDEX "LiveReviewIssue_liveReviewId_type_idx" ON "LiveReviewIssue"("liveReviewId", "type");

-- CreateIndex
CREATE INDEX "PromptVersion_key_status_idx" ON "PromptVersion"("key", "status");

-- CreateIndex
CREATE UNIQUE INDEX "PromptVersion_key_version_key" ON "PromptVersion"("key", "version");

-- CreateIndex
CREATE INDEX "KnowledgeDocument_category_status_idx" ON "KnowledgeDocument"("category", "status");

-- CreateIndex
CREATE INDEX "KnowledgeReview_knowledgeDocumentId_createdAt_idx" ON "KnowledgeReview"("knowledgeDocumentId", "createdAt");

-- CreateIndex
CREATE INDEX "KnowledgeReview_reviewerId_decision_idx" ON "KnowledgeReview"("reviewerId", "decision");

-- CreateIndex
CREATE INDEX "AuditLog_projectId_createdAt_idx" ON "AuditLog"("projectId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_createdAt_idx" ON "AuditLog"("actorId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_createdAt_idx" ON "AuditLog"("entityType", "entityId", "createdAt");
