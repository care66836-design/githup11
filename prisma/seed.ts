import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const permissions = [
  ['employee.manage', '员工管理'],
  ['project.create', '创建项目'],
  ['project.view_all', '查看全部项目'],
  ['project.assign', '分配项目'],
  ['client.sensitive_view', '查看敏感客户资料'],
  ['positioning.edit', '编辑定位'],
  ['report.review', '审核报告'],
  ['report.approve', '批准报告'],
  ['content.edit', '编辑内容'],
  ['live.edit', '管理直播'],
  ['commerce.edit', '管理商品'],
  ['report.export', '导出报告'],
  ['record.delete', '删除记录'],
  ['knowledge.review', '审核知识库'],
  ['audit.view', '查看操作日志'],
  ['system.configure', '系统设置'],
] as const

const roleDefinitions = [
  { code: 'ADMIN', name: '管理员', permissions: permissions.map(([code]) => code) },
  { code: 'PROJECT_LEAD', name: '项目负责人', permissions: ['project.create', 'project.assign', 'client.sensitive_view', 'positioning.edit', 'report.review', 'report.approve', 'content.edit', 'live.edit', 'commerce.edit', 'report.export'] },
  { code: 'IP_CONSULTANT', name: 'IP 顾问', permissions: ['client.sensitive_view', 'positioning.edit', 'content.edit', 'report.export'] },
  { code: 'CONTENT_PLANNER', name: '内容策划', permissions: ['content.edit', 'report.export'] },
  { code: 'LIVE_OPERATOR', name: '直播运营', permissions: ['live.edit', 'commerce.edit', 'report.export'] },
  { code: 'ECOM_OPERATOR', name: '电商运营', permissions: ['commerce.edit', 'live.edit', 'report.export'] },
  { code: 'STAFF', name: '普通员工', permissions: [] },
  { code: 'READ_ONLY', name: '只读成员', permissions: [] },
] as const

async function seedAccessControl() {
  for (const [code, name] of permissions) {
    await prisma.permission.upsert({
      where: { code },
      update: { name },
      create: { code, name },
    })
  }

  for (const roleDefinition of roleDefinitions) {
    const role = await prisma.role.upsert({
      where: { code: roleDefinition.code },
      update: { name: roleDefinition.name },
      create: { code: roleDefinition.code, name: roleDefinition.name },
    })

    for (const permissionCode of roleDefinition.permissions) {
      const permission = await prisma.permission.findUniqueOrThrow({ where: { code: permissionCode } })
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        update: {},
        create: { roleId: role.id, permissionId: permission.id },
      })
    }
  }
}

async function seedDemoProject() {
  const adminRole = await prisma.role.findUniqueOrThrow({ where: { code: 'ADMIN' } })
  const leadRole = await prisma.role.findUniqueOrThrow({ where: { code: 'PROJECT_LEAD' } })
  const consultantRole = await prisma.role.findUniqueOrThrow({ where: { code: 'IP_CONSULTANT' } })
  const contentRole = await prisma.role.findUniqueOrThrow({ where: { code: 'CONTENT_PLANNER' } })
  const liveRole = await prisma.role.findUniqueOrThrow({ where: { code: 'LIVE_OPERATOR' } })

  const admin = await prisma.employee.upsert({
    where: { email: 'admin@petip.local' },
    update: { roleId: adminRole.id, status: 'ACTIVE' },
    create: { id: 'employee-admin', name: '周楠', email: 'admin@petip.local', roleId: adminRole.id, status: 'ACTIVE' },
  })
  const lead = await prisma.employee.upsert({
    where: { email: 'lead@petip.local' },
    update: { roleId: leadRole.id, status: 'ACTIVE' },
    create: { id: 'employee-lead', name: '陈序', email: 'lead@petip.local', roleId: leadRole.id, status: 'ACTIVE' },
  })
  const consultant = await prisma.employee.upsert({
    where: { email: 'consultant@petip.local' },
    update: { roleId: consultantRole.id, status: 'ACTIVE' },
    create: { id: 'employee-consultant', name: '苏芮', email: 'consultant@petip.local', roleId: consultantRole.id, status: 'ACTIVE' },
  })
  const planner = await prisma.employee.upsert({
    where: { email: 'content@petip.local' },
    update: { roleId: contentRole.id, status: 'ACTIVE' },
    create: { id: 'employee-content', name: '唐可', email: 'content@petip.local', roleId: contentRole.id, status: 'ACTIVE' },
  })
  const liveOperator = await prisma.employee.upsert({
    where: { email: 'live@petip.local' },
    update: { roleId: liveRole.id, status: 'ACTIVE' },
    create: { id: 'employee-live', name: '许哲', email: 'live@petip.local', roleId: liveRole.id, status: 'ACTIVE' },
  })

  const client = await prisma.client.upsert({
    where: { id: 'client-linwan' },
    update: { displayName: '林晚' },
    create: {
      id: 'client-linwan',
      displayName: '林晚',
      city: '杭州',
      industryRole: '宠物出行品牌主理人',
      sensitivityLevel: 2,
      notes: '擅长产品判断，镜头表达偏克制，反感夸张销售。',
    },
  })

  const project = await prisma.project.upsert({
    where: { code: 'PET-2026-018' },
    update: { name: '林晚 × Momo 品牌主理人 IP', status: 'POSITIONING' },
    create: {
      id: 'project-momo',
      code: 'PET-2026-018',
      name: '林晚 × Momo 品牌主理人 IP',
      status: 'POSITIONING',
      currentStage: '定位方案审核',
      nextMilestone: '确认三案中的正式定位',
      nextMilestoneAt: new Date('2026-07-22T10:00:00+08:00'),
      clientId: client.id,
      createdById: lead.id,
    },
  })

  for (const [employeeId, role] of [
    [lead.id, 'OWNER'],
    [consultant.id, 'LEAD'],
    [planner.id, 'CONTRIBUTOR'],
    [liveOperator.id, 'CONTRIBUTOR'],
  ] as const) {
    await prisma.projectMember.upsert({
      where: { projectId_employeeId: { projectId: project.id, employeeId } },
      update: { role },
      create: { projectId: project.id, employeeId, role },
    })
  }

  const pet = await prisma.pet.upsert({
    where: { id: 'pet-momo' },
    update: { name: 'Momo' },
    create: {
      id: 'pet-momo',
      clientId: client.id,
      name: 'Momo',
      species: '犬',
      breed: '金毛寻回犬',
      appearance: '浅金色，体型偏大，笑脸明显',
      personality: '稳定、亲人、对新物品好奇',
      behavior: '出门前会主动叼牵引绳，进包后很安静',
      specialStories: '陪伴主理人完成品牌从 0 到 1，也是所有出行产品的第一体验官。',
      imageUrl: '/assets/momo.jpg',
    },
  })

  await prisma.petPersona.upsert({
    where: { projectId_petId: { projectId: project.id, petId: pet.id } },
    update: { roleName: '首席出行体验官' },
    create: {
      projectId: project.id,
      petId: pet.id,
      roleName: '首席出行体验官',
      oneSentenceRole: '一只用真实反应替主人检验出行装备的金毛。',
      personalityTags: '稳、好奇、有主见',
      coreMemoryPoint: '出门前自己叼牵引绳，测试时会用身体投票。',
      mainContentFunction: '产品体验、场景演示、关系情绪',
      suitableScenes: '城市通勤、自驾、露营、雨天出行',
      unsuitableTraits: '不强行塑造成搞怪型宠物',
      cameraSuitability: 86,
      contentSuitability: 92,
      liveSuitability: 72,
      storyPotential: 88,
      relationshipModel: '创业搭档型',
      emotionalValue: '一起把生活难题变成产品判断',
      recurringConflict: '主理人的理性标准与 Momo 的即时反应',
      recurringStory: '每次真实出行都产生一个选品判断',
      audienceConnection: '让养中大型犬的城市用户看到自己的出行困境',
      expectedChange: '从产品体验官成长为用户熟悉的选品搭档',
    },
  })

  const voiceProfile = await prisma.creatorVoiceProfile.upsert({
    where: { clientId: client.id },
    update: { approvedAt: new Date('2026-07-18T15:30:00+08:00'), approvedById: lead.id },
    create: {
      clientId: client.id,
      tone: '克制、直接、带一点冷幽默',
      professionalLevel: 82,
      humorLevel: 42,
      emotionalIntensity: 36,
      colloquialLevel: 76,
      sentenceLengthPreference: '短句为主，关键判断单独成句',
      rhythmStyle: '先给结论，再补场景和判断依据',
      commonWords: '我更在意、先别急、这个地方、说实话',
      bannedWords: '闭眼入、天花板、绝绝子、家人们冲、颠覆想象',
      catchphrases: '先别急着买。',
      openingStyle: '从一个真实使用动作或错误选择切入',
      endingStyle: '给明确适用边界，不做价值升华',
      controversyTolerance: 48,
      salesIntensity: 38,
      employeeNotes: '允许停顿和自我修正；不要连续排比，不虚构养宠经历。',
      approvedAt: new Date('2026-07-18T15:30:00+08:00'),
      approvedById: lead.id,
    },
  })

  if ((await prisma.voiceSample.count({ where: { voiceProfileId: voiceProfile.id } })) === 0) {
    await prisma.voiceSample.createMany({ data: [
      { voiceProfileId: voiceProfile.id, type: 'SPOKEN_TRANSCRIPT', title: '出行包测评口播', content: '先别急着看承重。狗进包以后能不能转身，背起来重心往不往后跑，这两个问题更实际。', isApproved: true },
      { voiceProfileId: voiceProfile.id, type: 'PUBLISHED_COPY', title: '品牌朋友圈', content: 'Momo 今天把第三版样包坐塌了。挺好，省得它到客户手上再塌。', isApproved: true },
      { voiceProfileId: voiceProfile.id, type: 'DISLIKED_STYLE', title: '禁用销售腔', content: '家人们这个真的闭眼入，错过就没有了。', isApproved: true },
    ] })
  }

  if ((await prisma.audienceSegment.count({ where: { projectId: project.id } })) === 0) {
    await prisma.audienceSegment.createMany({ data: [
      { projectId: project.id, type: 'CORE', name: '城市中大型犬精细养宠人', ageRange: '27-40', cities: '一二线城市', spendingPower: '中高', petOwnershipStage: '稳定养宠 1 年以上', lifestyle: '周末出行、通勤、自驾', painPoints: '产品尺寸难选、承重虚标、出行装备笨重', emotionalNeeds: '被理解，不被制造焦虑', contentNeeds: '明确选择标准和真实演示', purchaseScenarios: '短途自驾、公共交通、露营', decisionBarriers: '担心宠物不适、退换麻烦、功能夸大', categories: '出行包、牵引、车载用品、户外清洁', willingnessToPay: '愿为安全、耐用和售后付费' },
      { projectId: project.id, type: 'EXTENDED', name: '城市新手养犬人', ageRange: '23-35', painPoints: '不会判断尺寸和使用场景', emotionalNeeds: '减少试错', contentNeeds: '新手清单、对比和避坑' },
      { projectId: project.id, type: 'EXCLUDED', name: '只追求最低价的泛流量用户', painPoints: '价格是唯一决策标准', contentNeeds: '不建议长期迎合低价对比' },
    ] })
  }

  if ((await prisma.positioningSession.count({ where: { projectId: project.id } })) === 0) {
    const session = await prisma.positioningSession.create({
      data: { projectId: project.id, generatedById: consultant.id, diagnosisNote: '人物专业资产和产品资源强，宠物角色清晰；强销售能力一般，适合从选择判断建立信任。' },
    })

    const options = [
      {
        optionType: 'STABLE' as const,
        oneSentencePositioning: '主理人和金毛一起记录城市养犬出行，把每一次真实使用变成一条不踩坑的选择建议。',
        creatorPersona: '克制、可靠的宠物出行品牌主理人',
        petPersona: '首席出行体验官 Momo',
        relationshipModel: '创业搭档型',
        coreAudience: '一二线城市中大型犬主人',
        audienceValue: '降低出行装备选择成本',
        platformStrategy: '小红书图文与短视频为主，视频号沉淀信任',
        monetizationStrategy: '自有品牌 + 精选分销',
        liveCommerceFit: 72,
        executionDifficulty: 42,
        advantages: '持续性强，真实素材稳定，团队容易执行',
        disadvantages: '起量速度偏慢，话题爆发性有限',
        risks: '容易做成普通产品记录，需要持续给出判断',
        recommendationScore: 86,
      },
      {
        optionType: 'DIFFERENTIATED' as const,
        oneSentencePositioning: '让 Momo 用身体投票，拆穿宠物出行用品里那些看起来有用、实际难用的设计。',
        creatorPersona: '有产品洁癖的宠物装备拆解者',
        petPersona: '不会配合演戏的真实体验官',
        relationshipModel: '理性设计师 × 诚实体验官',
        coreAudience: '买过不少用品、开始关注设计细节的养犬人',
        audienceValue: '看懂产品设计背后的取舍',
        platformStrategy: '抖音反差演示起量，小红书沉淀完整判断',
        monetizationStrategy: '品牌广告 + 自有品牌 + 联名测评',
        liveCommerceFit: 78,
        executionDifficulty: 68,
        advantages: '记忆点强，差异明显，容易形成系列',
        disadvantages: '选题和测试成本较高',
        risks: '批评边界需要证据，避免无依据攻击竞品',
        recommendationScore: 91,
      },
      {
        optionType: 'COMMERCE' as const,
        oneSentencePositioning: '宠物出行主理人根据犬型、路线和使用频率，帮你选对一套真正会用的出行装备。',
        creatorPersona: '场景型宠物出行选品顾问',
        petPersona: '中大型犬尺寸示范官',
        relationshipModel: '专业顾问 × 产品体验搭档',
        coreAudience: '有明确出行购买需求的城市养犬家庭',
        audienceValue: '一套方法解决尺寸、场景和搭配问题',
        platformStrategy: '短视频建立场景，直播完成诊断式成交',
        monetizationStrategy: '自有品牌直播 + 互补品分销',
        liveCommerceFit: 92,
        executionDifficulty: 74,
        advantages: '商业承接清晰，直播主题稳定',
        disadvantages: '需要商品矩阵、客服与稳定直播排期',
        risks: '过早强销售会损伤主理人信任感',
        recommendationScore: 88,
      },
    ]

    for (const optionData of options) {
      const option = await prisma.positioningOption.create({ data: { positioningSessionId: session.id, ...optionData } })
      await prisma.contentPillar.createMany({ data: [
        { positioningOptionId: option.id, type: 'TRAFFIC', name: '城市养犬出行现场', description: '用真实问题和宠物反应吸引同类用户', ratio: optionData.optionType === 'COMMERCE' ? 30 : 35, suitableFormats: '短视频、日常记录', unsuitableFormats: '空泛知识口播', productionDifficulty: 45 },
        { positioningOptionId: option.id, type: 'TRUST', name: '产品判断与测试', description: '解释尺寸、结构、场景和取舍', ratio: 30, suitableFormats: '测评、对比、案例拆解', unsuitableFormats: '无依据拉踩', productionDifficulty: 65 },
        { positioningOptionId: option.id, type: 'PERSONA', name: '主理人与 Momo', description: '呈现工作选择和创业搭档关系', ratio: optionData.optionType === 'COMMERCE' ? 15 : 20, suitableFormats: '工作日常、幕后记录', unsuitableFormats: '强行情节表演', productionDifficulty: 35 },
        { positioningOptionId: option.id, type: 'CONVERSION', name: '场景选品', description: '处理具体购买顾虑并给出适用边界', ratio: optionData.optionType === 'COMMERCE' ? 25 : 15, suitableFormats: '直播切片、商品演示', unsuitableFormats: '叫卖式硬广', productionDifficulty: 58 },
      ] })
      await prisma.positioningScore.createMany({ data: [
        { positioningOptionId: option.id, module: '人物资产', dimension: '信任资产', score: 88, evidence: '有真实品牌研发和用户服务经历' },
        { positioningOptionId: option.id, module: '宠物资产', dimension: '内容适配', score: 92, evidence: 'Momo 对出行用品有稳定且可观察的反应' },
        { positioningOptionId: option.id, module: '执行能力', dimension: '持续产能', score: optionData.optionType === 'DIFFERENTIATED' ? 68 : 82, evidence: '每周可拍摄 2 天，现有产品和场景充足' },
      ] })
    }

    const selectedOption = await prisma.positioningOption.findFirstOrThrow({ where: { positioningSessionId: session.id, optionType: 'DIFFERENTIATED' } })
    await prisma.positioningReport.create({
      data: {
        projectId: project.id,
        selectedOptionId: selectedOption.id,
        title: '林晚 × Momo IP 定位报告',
        status: 'REVIEWED',
        createdById: consultant.id,
        lastEditedById: consultant.id,
        reviewedById: lead.id,
        reviewedAt: new Date('2026-07-19T10:20:00+08:00'),
        versions: { create: { version: 1, snapshot: { selectedOptionType: 'DIFFERENTIATED', recommendationScore: 91 }, changeNote: '首轮诊断后选择差异化方向，待负责人批准。' } },
      },
    })
  }

  if ((await prisma.contentPlan.count({ where: { projectId: project.id } })) === 0) {
    const plan = await prisma.contentPlan.create({
      data: {
        projectId: project.id,
        name: '启动期第 1 周内容计划',
        status: 'DRAFT',
        periodStart: new Date('2026-07-20T00:00:00+08:00'),
        periodEnd: new Date('2026-07-26T23:59:59+08:00'),
        createdById: planner.id,
      },
    })
    const planItem = await prisma.contentPlanItem.create({
      data: { contentPlanId: plan.id, title: '承重数字很大，不代表狗坐进去舒服', format: 'SHORT_VIDEO', mode: 'NATIVE_SPOKEN', objective: '建立产品判断信任', plannedAt: new Date('2026-07-21T18:00:00+08:00') },
    })
    const draft = await prisma.contentDraft.create({
      data: {
        projectId: project.id,
        contentPlanItemId: planItem.id,
        title: planItem.title,
        format: 'SHORT_VIDEO',
        mode: 'NATIVE_SPOKEN',
        status: 'STYLE_REVIEWED',
        currentBody: '先别急着看承重。Momo 二十八公斤，这个包写着能装三十五公斤，但它坐进去以后，后腿没有地方收。承重只是一个数字，底板、转身空间和背起来的重心，才决定你会不会真的带它出门。',
        createdById: planner.id,
        revisions: { create: { version: 1, source: 'AI_INITIAL', body: '很多人买宠物包只看承重，但真正重要的不是承重，而是舒适度。选择合适的宠物包，才能让每一次出行更加美好。' } },
      },
    })
    await prisma.contentRevision.create({ data: { contentDraftId: draft.id, version: 2, source: 'EMPLOYEE_EDIT', body: draft.currentBody, changeNote: '加入 Momo 体重和后腿动作，去掉模板化升华。', editedById: planner.id } })
    await prisma.aIStyleReview.create({
      data: {
        contentDraftId: draft.id,
        genericPhraseScore: 18,
        personaConsistencyScore: 91,
        spokenNaturalnessScore: 88,
        detailDensityScore: 86,
        repetitionScore: 12,
        salesPressureScore: 24,
        detectedProblems: ['结尾仍稍完整，可保留一个更自然的停顿'],
        rewriteSuggestions: ['最后一句可拆成两句，镜头切到实际背负动作'],
        reviewedById: planner.id,
      },
    })
  }

  const bagCategory = await prisma.productCategory.upsert({ where: { name: '宠物出行包' }, update: {}, create: { name: '宠物出行包', description: '背包、拉杆箱与车载出行载具' } })
  const travelCategory = await prisma.productCategory.upsert({ where: { name: '出行配件' }, update: {}, create: { name: '出行配件', description: '牵引、折叠碗、清洁与车载配件' } })

  if ((await prisma.product.count({ where: { projectId: project.id } })) === 0) {
    const hero = await prisma.product.create({ data: { projectId: project.id, categoryId: bagCategory.id, name: 'AirRide 城市出行包', sku: 'AR-01', role: 'HERO', suitablePets: '7kg 以下犬猫', useScenario: '公共交通、短途步行、城市通勤', coreSellingPoints: '稳定底板、三面通风、重心贴背', price: 399, grossMarginRate: 0.58, inventory: 320, afterSalesRisk: 35, returnRisk: 28, contentDisplayDifficulty: 25, liveExplanationDifficulty: 32 } })
    const traffic = await prisma.product.create({ data: { projectId: project.id, categoryId: travelCategory.id, name: '折叠随行水碗', sku: 'WB-02', role: 'TRAFFIC', suitablePets: '犬猫通用', useScenario: '散步、自驾、露营', coreSellingPoints: '单手展开、宽口易清洗', price: 39, grossMarginRate: 0.42, inventory: 1200, afterSalesRisk: 12, returnRisk: 10, contentDisplayDifficulty: 12, liveExplanationDifficulty: 10 } })
    const profit = await prisma.product.create({ data: { projectId: project.id, categoryId: bagCategory.id, name: 'RoadMate 车载安全舱', sku: 'RM-03', role: 'PROFIT', suitablePets: '15kg 以下犬猫', useScenario: '自驾、长途出行', coreSellingPoints: '双点固定、可拆洗、侧向支撑', price: 699, grossMarginRate: 0.64, inventory: 180, afterSalesRisk: 48, returnRisk: 38, contentDisplayDifficulty: 42, liveExplanationDifficulty: 55 } })
    for (const [product, recommendation] of [[hero, 'PRIORITY'], [traffic, 'RECOMMENDED'], [profit, 'TEST']] as const) {
      await prisma.productFitAssessment.create({ data: { projectId: project.id, productId: product.id, ipFit: product.role === 'HERO' ? 96 : 82, audienceFit: 88, shortVideoFit: 84, liveFit: product.role === 'HERO' ? 94 : 80, displayDifficulty: product.contentDisplayDifficulty, explanationDifficulty: product.liveExplanationDifficulty, afterSalesRisk: product.afterSalesRisk, returnRisk: product.returnRisk, grossMarginRate: product.grossMarginRate, recommendation, rationale: '符合城市出行定位，可通过 Momo 的真实动作展示选择标准。', assessedById: liveOperator.id } })
    }

    const liveProfile = await prisma.liveRoomProfile.create({
      data: {
        projectId: project.id,
        status: 'REVIEWED',
        oneSentencePositioning: '主理人根据犬型、路线和频率，现场帮城市养犬人选对出行装备。',
        hostRole: '克制的场景选品顾问',
        petRole: '真实尺寸和动作示范官',
        targetAudience: '正在为通勤、自驾或旅行选装备的城市犬主人',
        coreScenario: '把宠物体型和真实路线带进直播间现场诊断',
        retentionReason: '能立即获得尺寸与场景建议',
        trustReason: '主理人讲清适合与不适合，Momo 现场演示',
        purchaseReason: '减少买错尺寸和闲置的成本',
        productCategories: '出行包、车载安全、牵引、清洁配件',
        priceRange: '39-699 元',
        hostStyle: '先问场景，再给判断；弱销售，不叫卖',
        visualStyle: '明亮工作室，实物测试台，尺寸标尺常驻',
        liveRhythm: '每 20 分钟完成一次诊断、演示、顾虑处理和下单引导',
        petAppearancePlan: '每小时 3 次、每次 8-10 分钟，避免宠物疲劳',
        salesIntensity: 42,
      },
    })
    const session = await prisma.liveSession.create({
      data: {
        projectId: project.id,
        liveRoomProfileId: liveProfile.id,
        title: '城市通勤出行装备诊断场',
        platform: '抖音',
        status: 'REVIEWED',
        startedAt: new Date('2026-07-17T19:30:00+08:00'),
        endedAt: new Date('2026-07-17T21:30:00+08:00'),
        products: { create: [
          { productId: traffic.id, role: 'TRAFFIC', sortOrder: 1, targetUnits: 80 },
          { productId: hero.id, role: 'HERO', sortOrder: 2, targetUnits: 45 },
          { productId: profit.id, role: 'PROFIT', sortOrder: 3, targetUnits: 12 },
        ] },
      },
    })
    await prisma.liveScript.create({
      data: {
        projectId: project.id,
        liveRoomProfileId: liveProfile.id,
        liveSessionId: session.id,
        title: '城市通勤诊断场 v1',
        status: 'APPROVED',
        createdById: liveOperator.id,
        blocks: { create: [
          { type: 'OPENING', title: '先问路线', objective: '让目标用户快速确认直播间价值', content: '先别急着报体重。你平时是步行、开车，还是要坐地铁？路线不同，包的重点完全不一样。', durationSec: 90, sortOrder: 1 },
          { type: 'SCENE_DEMO', title: 'Momo 进包动作', objective: '用动作建立产品判断标准', content: '看它后腿怎么收、底板会不会往中间塌。这个比承重数字更诚实。', durationSec: 240, sortOrder: 2 },
          { type: 'OBJECTION_HANDLING', title: '尺寸顾虑', objective: '处理怕买错的主要阻力', content: '把肩高、背长和体重发出来。只给体重，我不会直接劝你买。', durationSec: 180, sortOrder: 3 },
          { type: 'CONVERSION_CALL', title: '适用边界', objective: '完成低压力成交', content: '如果你每周坐两次地铁，这个尺寸合适；只是一年旅行一次，先别买这么贵。', durationSec: 120, sortOrder: 4 },
        ] },
      },
    })
    await prisma.liveMetric.create({ data: { liveSessionId: session.id, durationMinutes: 120, viewers: 18640, averageConcurrentViewers: 312, peakConcurrentViewers: 681, entryRate: 0.184, averageWatchSeconds: 94, interactionRate: 0.126, productClickRate: 0.091, clickToOrderRate: 0.047, revenuePerThousandViews: 486, grossMerchandiseValue: 9058, unitsSold: 61, averageOrderValue: 148.49, refundRate: 0.061, newFollowers: 428, followConversionRate: 0.023, productBreakdownSnapshot: [{ sku: 'AR-01', gmv: 5985, units: 15 }, { sku: 'WB-02', gmv: 1872, units: 48 }], timeSegmentSnapshot: [{ range: '20:10-20:30', gmv: 2860 }], scriptNodeSnapshot: [{ block: '尺寸顾虑', orders: 18 }] } })
    await prisma.liveReview.create({ data: { liveSessionId: session.id, reviewerId: liveOperator.id, summary: '诊断式互动明显拉长停留，主推品点击高，但尺寸解释过晚，前 30 分钟流失较快。', nextSessionRecommendations: '开播第 5 分钟提前展示尺寸测量；每轮固定复述三项尺寸；车载安全舱先做内容测试再扩大库存。', issues: { create: [
      { type: 'RETENTION', severity: 3, evidence: '前 30 分钟平均停留仅 67 秒，低于全场 94 秒。', recommendation: '把 Momo 进包演示前置到首轮第 5 分钟。' },
      { type: 'SCRIPT', severity: 2, evidence: '用户重复询问尺寸，但主播未形成固定回答结构。', recommendation: '统一使用肩高、背长、体重三项诊断顺序。' },
      { type: 'FULFILLMENT_REFUND', severity: 2, evidence: '车载安全舱评论区出现安装复杂顾虑。', recommendation: '补充安装短视频和下单前车型确认。' },
    ] } } })
  }

  if ((await prisma.auditLog.count()) === 0) {
    await prisma.auditLog.createMany({ data: [
      { actorId: consultant.id, projectId: project.id, action: 'CREATE', entityType: 'PositioningSession', entityId: 'seed-positioning', summary: '生成三套定位方案' },
      { actorId: lead.id, projectId: project.id, action: 'REVIEW', entityType: 'PositioningReport', entityId: 'seed-report', summary: '完成定位报告初审' },
      { actorId: planner.id, projectId: project.id, action: 'UPDATE', entityType: 'ContentDraft', entityId: 'seed-draft', summary: '将 AI 初稿改为真实口播版本' },
      { actorId: admin.id, action: 'ASSIGN', entityType: 'ProjectMember', entityId: project.id, summary: '分配项目成员' },
    ] })
  }
}

async function main() {
  await seedAccessControl()
  await seedDemoProject()
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
