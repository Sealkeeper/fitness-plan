// Educational summaries, checked 2026-10-07. Clinical evidence concerns
// diagnosed populations and exercise programmes, not an isolated muscle.
export const HEALTH_SOURCES={
 neck:{name:'JOSPT · 颈痛临床指南（2017）',url:'https://pubmed.ncbi.nlm.nih.gov/28666405/'},
 cervicogenic:{name:'Jull 等 · 颈源性头痛随机试验（2002）',url:'https://pubmed.ncbi.nlm.nih.gov/12221344/'},
 tension:{name:'紧张型头痛运动 · 网络荟萃分析（2025）',url:'https://pubmed.ncbi.nlm.nih.gov/40257956/'},
 migraine:{name:'美国偏头痛基金会 · 运动与偏头痛（2024）',url:'https://americanmigrainefoundation.org/resource-library/migraine-and-exercise-benefits/'},
 classification:{name:'国际头痛学会 · ICHD-3 颈源性头痛',url:'https://ichd-3.org/11-headache-or-facial-pain-attributed-to-disorder-of-the-cranium-neck-eyes-ears-nose-sinuses-teeth-mouth-or-other-facial-or-cervical-structure/11-2-headache-attributed-to-disorder-of-the-neck/11-2-1-cervicogenic-headache/'},
 back:{name:'WHO · 慢性原发性腰痛指南（2023）',url:'https://www.who.int/publications/i/item/9789240081789'},
 motor:{name:'Cochrane · 腰痛运动控制训练综述（2016）',url:'https://pubmed.ncbi.nlm.nih.gov/27128390/'},
 shoulder:{name:'JOSPT · 肩袖肌腱病临床指南（2025）',url:'https://pubmed.ncbi.nlm.nih.gov/40165544/'},
 knee:{name:'NICE NG226 · 骨关节炎指南（2022）',url:'https://www.nice.org.uk/guidance/ng226/chapter/recommendations'},
 vein:{name:'ESVS · 下肢慢性静脉疾病指南（2022）',url:'https://pubmed.ncbi.nlm.nih.gov/35027279/'},
 pelvic:{name:'NICE NG210 · 盆底功能障碍指南（2021）',url:'https://www.nice.org.uk/guidance/ng210/chapter/recommendations'},
 activity:{name:'WHO · 身体活动与健康（2024）',url:'https://www.who.int/news-room/fact-sheets/detail/physical-activity'},
 axial:{name:'OpenStax · 头颈与背部解剖',url:'https://openstax.org/books/anatomy-and-physiology-2e/pages/11-3-axial-muscles-of-the-head-neck-and-back'},
 trunk:{name:'OpenStax · 腹壁与呼吸肌解剖',url:'https://openstax.org/books/anatomy-and-physiology-2e/pages/11-4-axial-muscles-of-the-abdominal-wall-and-thorax'},
 upper:{name:'OpenStax · 肩带与上肢解剖',url:'https://openstax.org/books/anatomy-and-physiology-2e/pages/11-5-muscles-of-the-pectoral-girdle-and-upper-limbs'},
 lower:{name:'OpenStax · 骨盆与下肢解剖',url:'https://openstax.org/books/anatomy-and-physiology-2e/pages/11-6-appendicular-muscles-of-the-pelvic-girdle-and-lower-limbs'},
};
export const HEALTH_TOPICS=[
 {id:'head',name:'头颈与头痛',intro:'先区分头痛类型，再考虑肌肉训练。颈痛伴头痛并不自动等于颈源性头痛。',muscles:['颈深屈肌','颈伸肌群','斜方肌中下部','肩胛提肌'],sections:[
 ['颈源性头痛','颈深屈肌、颈伸肌与肩胛肌群参与头颈控制。确诊后，低负荷颈肩耐力与协调训练可能帮助减轻头痛；研究支持的是组合方案，不能把效果归给单块肌肉。'],
 ['紧张型头痛','2025 年综述发现部分疼痛指标改善，但整体头痛频率结果不确定，证据确定性很低。不能用「肌肉紧」解释所有头痛，也不能保证拉伸就能缓解。'],
 ['偏头痛','逐步增加的规律有氧运动可能帮助管理发作；其收益来自整体活动，而非练强胸锁乳突肌或某块颈肌。发作中或运动诱发头痛时应调整并就医评估。'],
 ['头部血液循环','现有引用资料不能证明训练某块颈肌能增加脑供血或疏通椎动脉。头晕、头痛不能自行判定为「供血不足」；全身活动的心血管益处也不等于局部脑血流疗效。']],
 caution:'突然出现剧烈头痛，或伴肢体无力、语言异常、发热与颈僵，请及时急诊；首次运动诱发的头痛也需要评估。',refs:['classification','neck','cervicogenic','tension','migraine']},
 {id:'spine',name:'脊柱与腰背',intro:'从耐力、负荷承受与动作协调理解「护腰」，不要把腰痛简单归因于一块弱肌肉。',muscles:['多裂肌','腹横肌','竖脊肌','腹斜肌','臀大肌'],sections:[
 ['哪些肌肉参与','多裂肌协助节段控制；腹横肌与腹斜肌参与腹壁及躯干协调；竖脊肌维持躯干；臀肌参与髋部发力。它们共同承担活动任务。'],
 ['能带来什么','WHO 建议可将结构化运动作为慢性原发性腰痛综合照护的一部分。训练可能改善疼痛与活动能力；运动控制训练并未显示对其他运动有临床重要优势。']],
 caution:'这不表示练核心能复位椎间盘或保证无腰痛。新出现大小便异常、会阴麻木或进行性腿无力，需要紧急评估。',refs:['back','motor']},
 {id:'shoulder',name:'肩关节与抬臂',intro:'肩袖、肩胛肌与三角肌协作，让抬手和拿取物品更有能力。',muscles:['肩袖','前锯肌','斜方肌中下部','三角肌中束'],sections:[
 ['训练的意义','2025 年肩袖肌腱病指南支持主动康复，包括运动控制与不同负荷的抗阻练习，以减轻疼痛和功能障碍。'],
 ['适用范围','这是确诊肩袖肌腱病的康复建议。各块肌肉的作用来自解剖功能推断，不能保证预防所有肩痛，也不能仅凭圆肩判断病因。']],caution:'根据症状和承受能力选择负荷；相关动作库用于了解训练，不能直接当作肩伤处方。',refs:['shoulder','upper']},
 {id:'lower',name:'髋膝与步行',intro:'下肢肌肉帮助起立、上下楼和单腿支撑，力量与平衡需要一起训练。',muscles:['股四头肌','臀中肌','臀大肌','腘绳肌','足踝稳定肌'],sections:[
 ['哪些肌肉参与','股四头肌帮助伸膝与蹲起；臀中肌帮助单腿支撑；臀大肌参与伸髋；腘绳肌协助屈膝；踝周肌控制落脚与推进。'],
 ['临床证据','NICE 推荐骨关节炎患者采用个体化治疗性运动，例如局部力量与有氧训练，以改善症状和功能。该建议不意味着训练能再生软骨或消除关节磨损。']],caution:'相关肌肉列表表示功能关联；并非所有列出的肌肉都有单独治疗膝痛的试验证据。',refs:['knee','lower']},
 {id:'vein',name:'小腿与静脉回流',intro:'小腿肌肉收缩配合静脉瓣，是下肢静脉血回流的辅助机制。',muscles:['腓肠肌','比目鱼肌','小腿'],sections:[
 ['肌肉泵怎样工作','腓肠肌与比目鱼肌收缩时帮助挤压腿部静脉。步行与踝部活动可让肌肉泵参与工作，久坐时起身活动是实用选择。'],
 ['证据与边界','ESVS 指南建议慢性静脉疾病患者考虑运动以减轻静脉症状。这是下肢静脉回流，与「头部供血」不同；不能据此保证治好静脉曲张或预防血栓。']],caution:'突发单侧小腿肿痛应先就医，避免自行用提踵或按摩处理。',refs:['vein','lower']},
 {id:'breath',name:'呼吸与盆底',intro:'膈肌、腹壁与盆底参与呼吸和压力协调；不同问题需要不同练法。',muscles:['膈肌','腹横肌','盆底肌'],sections:[
 ['呼吸与腹壁','膈肌是主要吸气肌，腹壁参与呼气与腹压管理。轻松、不憋气的呼吸协调可以用于训练动作学习；不能由此推断能治疗消化病或提升肺功能。'],
 ['盆底功能','NICE 推荐压力性或混合性尿失禁女性接受至少 3 个月的监督下盆底训练。训练包括正确收缩与放松，不能把所有盆底不适都当作无力。']],caution:'盆底疼痛或难以放松时，先做专业评估，避免持续用力夹紧。',refs:['trunk','pelvic']},
 {id:'daily',name:'日常能力与整体健康',intro:'从拿取、推拉、步行和抗阻活动出发，建立可持续的身体能力。',muscles:['胸大肌','背阔肌','肱二头肌','肱三头肌','前臂'],sections:[
 ['整体收益','规律身体活动与肌力训练有助于维持身体功能，整体活动还与心血管、代谢及心理健康收益有关。'],
 ['不要把收益拆给单块肌肉','一块肌肉更有力，首先意味着相关动作的能力提高；不能自动推断某块肌肉能治疗内脏疾病、改善脑供血或预防所有疼痛。']],caution:'结合全身力量、有氧与日常活动，逐步增加负荷；出现持续不适时按具体情况评估。',refs:['activity']},
];
const profiles={
 head:{title:'头颈控制 · 颈源性头痛的辅助康复',benefit:'确诊颈源性头痛后，颈部与肩胛的协调、耐力训练可能帮助减轻症状。',evidence:'指南 + 随机试验；证据针对组合训练，未证明单独强化这块肌肉能治疗头痛。',advice:'可在评估后学习轻柔点头、颈部耐力及肩胛控制；从低负荷开始，不强扳脖子。',limits:'不能推广到所有头痛；没有据此改善脑供血的证据。',refs:['neck','cervicogenic'],topics:['head']},
 spine:{title:'躯干承受能力 · 慢性腰背痛管理',benefit:'躯干与髋部训练可作为慢性原发性腰痛的综合管理内容，帮助改善活动能力。',evidence:'WHO 条件性建议，证据确定性低；Cochrane 未发现运动控制训练明显优于其他运动。',advice:'选择能承受的躯干、髋部和全身活动，逐步增加；康复中不必一味追求收紧腹部。',limits:'解剖上的稳定作用不等于单肌治疗证据，也不意味着能复位椎间盘。',refs:['back','motor'],topics:['spine']},
 shoulder:{title:'肩关节负荷与抬臂能力',benefit:'肩袖肌腱病的主动康复可能减轻疼痛、改善功能，常涉及肩部与肩胛协作。',evidence:'2025 年临床指南支持主动运动康复；该肌的参与来自功能关联，疗效未单独归因。',advice:'从可承受范围内的抬臂、肩胛控制或轻负荷抗阻练习开始；肩痛时先明确适用方案。',limits:'不保证预防肩痛；疼痛并不必然代表姿势错误或某块肌肉弱。',refs:['shoulder','upper'],topics:['shoulder']},
 lower:{title:'髋膝控制 · 起立与步行能力',benefit:'个体化下肢力量与有氧活动可帮助骨关节炎患者改善症状和功能。',evidence:'NICE 指南推荐治疗性运动；这是整体方案证据，未证明每块参与肌肉的独立疗效。',advice:'根据能力选择蹲起、支撑、步行或轻负荷练习，逐步增加；有症状时可接受监督指导。',limits:'不能据此声称训练能修复软骨、避免所有关节损伤或治愈膝痛。',refs:['knee','lower'],topics:['lower']},
 vein:{title:'小腿肌肉泵 · 下肢静脉回流',benefit:'收缩帮助下肢静脉血回流。步行与踝部活动可让肌肉泵工作。',evidence:'ESVS 指南建议慢性静脉疾病患者考虑运动减轻症状；不等于单肌训练能治愈静脉疾病。',advice:'久坐时适时起身步行，或做舒适的踝部活动；已诊断静脉疾病时结合医生建议。',limits:'这是下肢静脉回流，不是脑供血疗效，也不能代替血栓的诊治。',refs:['vein','lower'],topics:['vein','lower']},
 breath:{title:'呼吸与腹压的协调',benefit:'参与呼吸动作与压力协调，帮助理解训练中怎样自然呼吸。',evidence:'解剖功能；这里没有用于治疗消化病或改善肺病的临床证据。',advice:'练习舒适的呼吸与动作配合，避免持续憋气；呼吸困难需按病因评估。',limits:'不能把呼吸时的腹部活动理解成能按摩内脏或治疗消化问题。',refs:['trunk'],topics:['breath']},
 pelvic:{title:'控尿与盆底协调',benefit:'正确的盆底收缩与放松训练，可用于部分压力性或混合性尿失禁女性的管理。',evidence:'NICE 推荐至少 3 个月监督下训练；适用于上述人群，不是所有盆底问题的统一方案。',advice:'先学习正确收缩和充分放松，并评估是否需要力量、协调或放松训练。',limits:'疼痛、过度紧张或放松困难时，不应一味加强收缩；本建议不能直接外推所有人。',refs:['pelvic','trunk'],topics:['breath']},
 daily:{title:'日常动作能力与肌力储备',benefit:'逐步抗阻训练可提高相关动作的力量与耐力，帮助维持日常活动能力。',evidence:'解剖功能 + 整体身体活动建议；没有为这块肌肉赋予单独治疗某种疾病的疗效。',advice:'结合全身训练，选择舒适、可控的推拉、握持或活动练习，逐步加量。',limits:'全身活动的心血管与代谢收益，不能归结为只练某块肌肉。',refs:['activity','upper'],topics:['daily']},
};
// One role per named muscle, preserving useful distinctions within a group.
const rows=[
 ['股四头肌','lower','伸膝，帮助从椅子起身、下蹲控制与上下楼。'],
 ['臀大肌','lower','伸髋，参与起立、上楼与髋铰链，帮助髋部承担动作任务。',['spine']],
 ['腘绳肌','lower','屈膝并参与伸髋，与大腿前侧肌肉协作控制下肢。'],
 ['臀中肌','lower','单腿支撑时帮助控制骨盆，参与步行与侧向稳定。'],
 ['臀小肌','lower','与臀中肌协作控制髋部和单腿支撑时的骨盆位置。'],
 ['内收肌','lower','控制髋内收，参与下肢侧向动作及支撑时的协调。'],
 ['阔筋膜张肌','lower','参与髋屈、外展与内旋，并通过髂胫束参与下肢控制。'],
 ['髋屈肌','lower','抬腿和迈步；髂腰肌是其中主要肌群，需与臀肌协调。'],
 ['腓肠肌','vein','参与踝跖屈与屈膝，步行推进和直膝提踵时参与发力。'],
 ['比目鱼肌','vein','参与踝跖屈与站立支撑，不跨膝，屈膝时仍能发力。'],
 ['小腿','vein','是区域名称，后侧跖屈肌和前侧背屈肌承担不同任务。'],
 ['足踝稳定肌','lower','踝周及足部多块肌肉共同控制落脚、足弓和身体平衡。'],
 ['深层髋外旋肌','lower','参与髋旋转与股骨位置控制；不是单独的骨盆矫正工具。'],
 ['背阔肌','daily','肩伸与内收，参与拉物、攀拉等上肢活动。'],
 ['菱形肌','shoulder','肩胛后缩与下回旋，与其他肩胛肌协作完成上肢活动。'],
 ['斜方肌中下部','shoulder','中部参与肩胛后缩，下部参与下压与上回旋；帮助肩胛协作。',['head']],
 ['斜方肌','shoulder','上中下部协作控制肩胛，参与抬臂及头颈、肩带负荷分配。',['head']],
 ['上斜方肌','head','参与肩胛上提和上回旋，是颈肩协作的一部分；不是所有头痛的来源。',['shoulder']],
 ['大圆肌','daily','肩伸、内收与内旋，协助拉物；不属于肩袖肌群。'],
 ['竖脊肌','spine','维持和伸展躯干，在提物与髋铰链中帮助承担躯干负荷。'],
 ['多裂肌','spine','短肌束跨越椎骨，参与脊柱节段控制与运动协调。'],
 ['腰方肌','spine','参与躯干侧屈和负荷控制，并固定第十二肋。'],
 ['前锯肌','shoulder','帮助肩胛贴住胸廓并上回旋，参与举手和推物。'],
 ['肩袖','shoulder','四块肌肉共同参与肩关节控制；各自承担旋转或外展任务。'],
 ['冈上肌','shoulder','属于肩袖，参与肩外展及肱骨头控制。'],
 ['肩带','shoulder','是功能区域名称，肩胛肌、肩袖和三角肌需要协作。'],
 ['前臂','daily','多块肌肉共同控制腕指、握持与前臂旋转，帮助拿取和操作物品。'],
 ['肱桡肌','daily','屈肘并帮助前臂回到中立位置，参与搬拿动作。'],
 ['胸大肌','daily','肩内收和内旋，参与推门、撑起身体等日常推力动作。'],
 ['胸大肌锁骨部','daily','胸大肌的上部纤维，参与肩屈与向前推物。'],
 ['胸大肌下部','daily','胸大肌胸肋部等纤维，参与肩内收与从抬臂位置带回手臂。'],
 ['三角肌前束','shoulder','向前抬臂，帮助把物品举到身前。'],
 ['三角肌中束','shoulder','向侧方抬臂，与肩袖、肩胛肌一起完成上肢活动。'],
 ['后束三角肌','shoulder','向后带动上臂，参与伸肩、外旋和水平外展。'],
 ['肱二头肌','daily','屈肘与前臂旋后，帮助提物和把手掌转向上方。'],
 ['肱肌','daily','在不同前臂位置都参与屈肘，帮助拿起物品。'],
 ['肱三头肌','daily','伸肘，参与推物、撑起身体和上肢支撑。'],
 ['肱三头肌长头','daily','伸肘，同时跨越肩关节，参与肩伸和内收。'],
 ['肱三头肌外侧头','daily','参与伸肘，与其他头共同完成推力和支撑动作。'],
 ['肘肌','daily','协助伸肘与肘关节控制；作用属于日常功能关联。'],
 ['核心','spine','是躯干控制系统的统称，包括腹壁、背肌等，而非一块肌肉。'],
 ['膈肌','breath','收缩时下降，帮助胸腔扩张，是主要吸气肌。'],
 ['腹横肌','spine','参与腹壁张力、腹压和躯干协调；不需要全天持续收紧。',['breath']],
 ['腹直肌','spine','参与躯干屈曲及骨盆控制，与其他躯干肌共同承担活动。'],
 ['腹直肌下部','spine','是腹直肌的下方区域，与整块腹直肌共同参与躯干和骨盆控制。'],
 ['盆底肌','pelvic','支撑盆腔结构并参与控尿；收缩和充分放松都重要。'],
 ['腹斜肌','spine','腹内、外斜肌参与躯干旋转、侧屈与腹压协调。'],
 ['胸锁乳突肌','head','参与转头、颈屈与侧屈；协调训练比单纯追求更强更合适。'],
 ['颈深屈肌','head','颈椎前方深层肌肉，参与轻微点头与头颈控制。'],
 ['头长肌','head','属于颈深屈肌，参与头部轻微屈曲与控制。'],
 ['颈长肌','head','属于颈深屈肌，参与颈椎屈曲与协调控制。'],
 ['颈伸肌群','head','后颈多块肌肉帮助承托和转动头部，与屈肌协作。'],
 ['肩胛提肌','head','连接颈椎与肩胛，参与提肩与头颈、肩带的负荷协调。'],
 ['颈侧屈肌群','head','多块颈侧肌参与侧屈；斜角肌也可辅助吸气。手麻不宜自行归因于肌肉紧。'],
 ['胸小肌','shoulder','连接肋骨与肩胛喙突，参与肩胛位置控制；不能只凭紧张判断肩痛原因。'],
 ['缝匠肌','lower','参与髋屈、外展、外旋与屈膝，协助多方向下肢动作。'],
 ['胫骨前肌','lower','抬起脚尖，参与步行落脚控制与跨步时的足部离地。'],
];
export const MUSCLE_HEALTH=Object.fromEntries(rows.map(([name,profile,role,extra=[]])=>[name,{...profiles[profile],role,topics:[...new Set([...profiles[profile].topics,...extra])]}]));
const aliases={'胸大肌 · 锁骨部':'胸大肌锁骨部','胸大肌 · 胸肋部':'胸大肌下部','三角肌后束':'后束三角肌','斜方肌 · 上部':'上斜方肌','竖脊肌群':'竖脊肌','肩袖肌群':'肩袖','前臂屈肌群':'前臂','前臂伸肌群':'前臂','腹外斜肌':'腹斜肌','腹内斜肌':'腹斜肌','腘绳肌群':'腘绳肌','髋内收肌群':'内收肌','髂腰肌':'髋屈肌','头颈夹肌':'颈伸肌群'};
export const muscleHealthFor=name=>MUSCLE_HEALTH[aliases[name]||name]||null;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function sourceLinks(refs){return [...new Set(refs)].map(id=>{const s=HEALTH_SOURCES[id];return `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.name)} ↗</a>`;}).join('');}
export function healthHTML(name){
 const h=muscleHealthFor(name);if(!h)return '';
 return `<div class="mh-health"><div class="mh-goal">${esc(h.title)}</div><p><b>功能关联</b>${esc(h.role)}</p><p><b>可能的健康益处</b>${esc(h.benefit)}</p><details class="mh-evidence"><summary>证据、练习思路与适用范围</summary><p><b>证据说明</b>${esc(h.evidence)}</p><p><b>练习思路</b>${esc(h.advice)}</p><p><b>适用边界</b>${esc(h.limits)}</p><div class="mh-source-links">${sourceLinks(h.refs)}</div></details></div>`;
}
export function healthOverviewHTML(){return `<section class="mh-overview" aria-label="按健康目标了解肌肉"><div class="mh-overview-heading"><span>从身体需求出发</span><small>资料核对：2026-10-07 · 科普，不代替诊疗</small></div><div class="mh-topic-grid">${HEALTH_TOPICS.map(t=>`<details class="mh-topic" data-health-card="${t.id}"><summary>${esc(t.name)}<span>查看相关肌肉与证据 ＋</span></summary><p>${esc(t.intro)}</p>${t.sections.map(([title,text])=>`<p><b>${esc(title)}</b>${esc(text)}</p>`).join('')}<div class="mh-muscle-chips">${t.muscles.map(n=>`<button type="button" data-health-muscle="${esc(n)}">${esc(n)} ↗</button>`).join('')}</div><p class="mh-caution">${esc(t.caution)}</p><div class="mh-source-links">${sourceLinks(t.refs)}</div></details>`).join('')}</div><p class="mh-overview-note">点击肌肉可查看三维位置；模型未收录的名称可跳转到下方介绍。证据针对特定人群与训练方案，肌肉参与某个动作并不等于具有独立治疗效果。</p></section>`;}
// Shared by the original muscle library and the 3D viewer, including exports.
if(typeof window!=='undefined')Object.assign(window,{muscleHealthFor,muscleHealthHTML:healthHTML,muscleHealthOverviewHTML:healthOverviewHTML});
