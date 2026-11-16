// Original summaries of standard anatomy. Reference chapters and model licenses
// are linked in the viewer and assets/anatomy/ATTRIBUTION.md.
const rows = [
 ['chest','胸大肌','Pectoralis major','胸肩','pectoralis major','胸廓前上方，从锁骨、胸骨和肋软骨向上臂汇聚。','肩内收、内旋；锁骨部参与肩屈。','胸前的扇形肌肉。不同纤维方向一起参与推举和夹胸。','front',['胸大肌','胸大肌锁骨部','胸大肌下部']],
 ['chest-upper','胸大肌 · 锁骨部','Clavicular part of pectoralis major','胸肩','clavicular part of .*pectoralis major','锁骨内侧下方，位于胸大肌上缘。','肩屈、肩水平内收。','俗称「上胸」，是胸大肌的一部分，并非独立肌肉。','front',['胸大肌锁骨部']],
 ['chest-lower','胸大肌 · 胸肋部','Sternocostal part of pectoralis major','胸肩','sternocostal part of .*pectoralis major','胸骨及上位肋软骨前方，构成胸大肌的主要部分。','肩内收、内旋；可使已屈曲的上臂伸展。','与锁骨部、腹部纤维共同构成胸大肌。','front',['胸大肌','胸大肌下部']],
 ['deltoid-front','三角肌前束','Clavicular part of deltoid','胸肩','clavicular part of .*deltoid','肩关节前侧，从锁骨外侧延伸到肱骨。','肩屈、内旋。','抬臂向前和推举时参与发力。','front',['三角肌前束']],
 ['deltoid-mid','三角肌中束','Acromial part of deltoid','胸肩','acromial part of .*deltoid','肩峰外侧，覆盖肩关节的外侧轮廓。','肩外展。','向身体侧面抬起手臂时的主要发力肌之一。','front',['三角肌中束']],
 ['deltoid-back','三角肌后束','Spinal part of deltoid','胸肩','spinal part of .*deltoid','肩关节后侧，从肩胛冈延伸到肱骨。','肩伸、外旋、水平外展。','把上臂向后带和反向飞鸟时参与发力。','back',['后束三角肌','三角肌后束']],
 ['serratus','前锯肌','Serratus anterior','胸肩','serratus anterior','胸廓两侧，锯齿状肌束贴着肋骨延伸至肩胛骨内侧缘。','肩胛骨前伸、上回旋；使肩胛骨贴住胸廓。','侧面更容易观察。肩胛骨的稳定与抬臂需要它参与。','side',['前锯肌']],
 ['pec-minor','胸小肌','Pectoralis minor','胸肩','pectoralis minor','胸大肌深面，从肋骨连接至肩胛骨喙突。','使肩胛骨前伸、下压，辅助固定肩胛骨。','被胸大肌覆盖，可用「透视」或「单独」查看。','front',[]],
 ['lat','背阔肌','Latissimus dorsi','背部','latissimus dorsi','背部中下段两侧，宽大的肌束向腋后方和肱骨汇聚。','肩伸、内收、内旋。','引体和划船时参与发力，构成背部两侧轮廓。','back',['背阔肌']],
 ['traps','斜方肌','Trapezius','背部','trapezius','后颈到胸段背部，左右两侧合成近似菱形。','不同纤维分别参与肩胛骨上提、后缩、下压及上回旋。','上、中、下部纤维走向不同，不能用耸肩代表全部功能。','back',['斜方肌','上斜方肌','斜方肌中下部','斜方肌下部']],
 ['traps-upper','斜方肌 · 上部','Descending part of trapezius','背部','descending part of .*trapezius','后颈两侧至锁骨外侧和肩峰。','肩胛骨上提，与下部共同参与肩胛骨上回旋。','耸肩时明显参与发力。','back',['上斜方肌']],
 ['rhomboid','菱形肌','Rhomboid major & minor','背部','rhomboid','脊柱与肩胛骨内侧缘之间，位于斜方肌深面。','肩胛骨后缩、下回旋。','位于浅层肌肉之下，可用「透视」查看它与肩胛骨的关系。','back',['菱形肌']],
 ['erector','竖脊肌群','Erector spinae','背部','\\b(?:iliocostalis|longissimus|spinalis)\\b','沿脊柱两侧纵向排列，由髂肋肌、最长肌和棘肌等组成。','伸展脊柱；单侧收缩参与侧屈。','是肌群名称。髋铰链动作中常承担躯干稳定任务。','back',['竖脊肌']],
 ['multifidus','多裂肌','Multifidus','背部','multifidus','脊柱两侧的深层，多个短肌束跨越相邻椎骨。','脊柱伸展、对侧旋转与节段稳定。','深层结构，切换「单独」可以清楚观察。','back',['多裂肌']],
 ['teres-major','大圆肌','Teres major','背部','teres major','肩胛骨下角附近，经腋后方连接肱骨。','肩内收、内旋、伸展。','靠近背阔肌上缘；大圆肌不属于肩袖。','back',['大圆肌']],
 ['cuff','肩袖肌群','Rotator cuff','胸肩','supraspinatus|infraspinatus|subscapularis|teres minor','肩胛骨前后及肩关节周围，由四块肌肉组成。','稳定肱骨头；不同肌肉参与外展、外旋或内旋。','包含冈上肌、冈下肌、小圆肌和肩胛下肌。','back',['肩袖','冈上肌','肩外旋肌群']],
 ['biceps','肱二头肌','Biceps brachii','手臂','biceps brachii','上臂前侧，有长头和短头，经肌腱连接至桡骨。','屈肘、前臂旋后；辅助肩屈。','两头在上臂汇合。弯举与拉力动作中常参与发力。','front',['肱二头肌']],
 ['triceps','肱三头肌','Triceps brachii','手臂','triceps brachii','上臂后侧，由长头、外侧头和内侧头组成。','伸肘；长头还参与肩伸及内收。','长头跨越肩关节，因此手臂位置会影响其长度。','back',['肱三头肌','肱三头肌长头','肱三头肌外侧头']],
 ['brachialis','肱肌','Brachialis','手臂','\\bbrachialis\\b','上臂前侧的深层，位于肱二头肌下方。','屈肘。','不同前臂旋转位置下都可以参与屈肘。','front',['肱肌']],
 ['brachioradialis','肱桡肌','Brachioradialis','手臂','brachioradialis','前臂桡侧浅层，从肱骨外侧连接至桡骨远端。','屈肘；帮助前臂回到中立位。','锤式弯举时参与发力；可在前臂外侧观察。','front',['肱桡肌']],
 ['forearm-flex','前臂屈肌群','Forearm flexors','手臂','flexor carpi|palmaris longus|flexor digitorum (?:profundus|superficialis)|flexor pollicis longus','前臂前侧，多条肌肉经肌腱连接手腕和手指。','不同肌肉分别参与屈腕、屈指与握持。','这是多个肌肉的集合，握力并非由一块肌肉独立完成。','front',['前臂']],
 ['forearm-ext','前臂伸肌群','Forearm extensors','手臂','extensor carpi|extensor digitorum(?! longus)|extensor pollicis|extensor indicis|extensor digiti minimi','前臂后侧，长肌腱延伸到手背和手指。','不同肌肉分别参与伸腕、伸指。','前臂旋转后，可更清楚观察腕指伸肌。','back',['前臂']],
 ['rectus','腹直肌','Rectus abdominis','核心','rectus abdominis','腹壁正中两侧，从耻骨向上连到胸骨和肋软骨。','屈曲躯干，参与腹压与骨盆控制。','肌腹被腱划分段；上腹、下腹是同一对肌肉的不同区域。','front',['腹直肌','腹直肌下部','核心']],
 ['oblique','腹外斜肌','External oblique','核心','external oblique','腹壁两侧的浅层，肌纤维由外上方向内下方斜行。','双侧使躯干屈曲；单侧参与对侧旋转及同侧侧屈。','与腹内斜肌、腹横肌共同构成侧腹壁。','front',['腹斜肌','核心']],
 ['oblique-inner','腹内斜肌','Internal oblique','核心','internal oblique','腹外斜肌深面，纤维大体向内上方走行。','躯干屈曲、同侧旋转及侧屈，参与腹压。','深层腹壁，可用「单独」对照外斜肌的纤维方向。','front',['腹斜肌','核心']],
 ['transverse','腹横肌','Transversus abdominis','核心','transversus abdominis','腹壁最深层，纤维大体横向环绕腹部。','压缩腹腔、参与腹压及躯干稳定。','不是体表可见的「六块腹肌」，需要观察深层。','front',['腹横肌','核心']],
 ['ql','腰方肌','Quadratus lumborum','核心','quadratus lumborum','后腹壁两侧，位于髂嵴、第十二肋与腰椎之间。','躯干侧屈，固定第十二肋，辅助腰椎稳定。','位于后腹壁深层，选择后使用「单独」观察更清楚。','back',['腰方肌']],
 ['glute-max','臀大肌','Gluteus maximus','臀腿','gluteus maximus','臀部后侧浅层，覆盖臀区主要轮廓。','伸髋、髋外旋。','臀桥、蹲起和髋铰链动作中参与发力。','back',['臀大肌','臀肌']],
 ['glute-med','臀中肌','Gluteus medius','臀腿','gluteus medius','髋外侧偏上，后部被臀大肌部分覆盖。','髋外展；单腿支撑时维持骨盆稳定。','在身体侧面观察较清楚。','side',['臀中肌']],
 ['glute-min','臀小肌','Gluteus minimus','臀腿','gluteus minimus','髋外侧的深层，位于臀中肌下方。','髋外展、内旋，辅助骨盆稳定。','使用「单独」显示可观察它与臀中肌的层次。','side',['臀小肌']],
 ['quads','股四头肌','Quadriceps femoris','臀腿','rectus femoris|vastus','大腿前侧，由股直肌、股外侧肌、股内侧肌和股中间肌组成。','伸膝；股直肌还参与屈髋。','四块肌肉共享伸膝功能，股中间肌位于较深层。','front',['股四头肌']],
 ['hamstrings','腘绳肌群','Hamstrings','臀腿','biceps femoris|semitendinosus|semimembranosus','大腿后侧，主要包括股二头肌长头、半腱肌、半膜肌。','屈膝、伸髋；股二头肌短头只跨膝关节。','本视图也显示邻近的股二头肌短头，并标出其独立名称。','back',['腘绳肌']],
 ['adductors','髋内收肌群','Hip adductors','臀腿','adductor (?!.*(?:pollicis|hallucis))|gracilis|pectineus','大腿内侧，包括长收肌、短收肌、大收肌等。','髋内收；不同肌肉也参与屈髋、伸髋或旋转。','与前侧和后侧肌群不同，主要分布在大腿内侧。','front',['内收肌']],
 ['hip-flex','髂腰肌','Iliopsoas','臀腿','psoas major|iliacus','后腹壁及髂窝深层，经髋关节前方连接股骨。','屈髋。','由腰大肌与髂肌组成，位于表层腹肌和骨盆结构之下。','front',['髋屈肌']],
 ['sartorius','缝匠肌','Sartorius','臀腿','sartorius','由髋前外侧斜跨大腿前面，向膝内侧延伸。','屈髋、外展、外旋；参与屈膝。','长而细的带状肌肉，很适合在前视图中辨认。','front',[]],
 ['calf','腓肠肌','Gastrocnemius','臀腿','gastrocnemius','小腿后侧浅层，内外侧两头构成小腿肚上部。','踝跖屈（踮脚）、屈膝。','跨越膝与踝两个关节，直膝提踵时常参与发力。','back',['腓肠肌','小腿']],
 ['soleus','比目鱼肌','Soleus','臀腿','soleus','小腿后侧，位于腓肠肌深面，下部可在两侧见到。','踝跖屈。','不跨膝关节；屈膝提踵依然能够训练它。','back',['比目鱼肌','小腿']],
 ['tibialis','胫骨前肌','Tibialis anterior','臀腿','tibialis anterior','小腿前侧，沿胫骨外侧向足内侧延伸。','踝背屈、足内翻。','脚尖抬起时参与发力，与小腿后侧跖屈肌相对。','front',['足踝稳定肌']],
 ['scm','胸锁乳突肌','Sternocleidomastoid','颈部','sternocleidomastoid','颈前外侧，从耳后乳突斜向胸骨及锁骨。','双侧参与颈屈；单侧使头同侧侧屈、对侧旋转。','可从前侧观察其斜行的左右肌束。','front',['胸锁乳突肌']],
 ['neck-deep','颈深屈肌','Longus colli & capitis','颈部','longus colli|longus capitis','颈椎前方深层，包含颈长肌与头长肌。','头颈屈曲，辅助颈椎稳定。','被颈部浅层结构覆盖，选择后使用「单独」。','front',['颈深屈肌','头长肌','颈长肌']],
 ['levator','肩胛提肌','Levator scapulae','颈部','levator scapulae','颈椎上部两侧向下连接至肩胛骨内上角。','肩胛骨上提、下回旋；辅助颈部侧屈。','沿后颈外侧观察，部分被斜方肌覆盖。','back',['肩胛提肌']],
 ['splenius','头颈夹肌','Splenius capitis & cervicis','颈部','splenius','后颈深层，由脊柱向头颈上方斜行。','头颈伸展；同侧旋转与侧屈。','属于后颈伸肌的一部分，可用「单独」查看。','back',['颈伸肌群']],
];
export const GROUPS=rows.map(([id,name,en,part,pattern,loc,action,note,view,keys])=>({id,name,en,part,pattern:new RegExp(pattern,'i'),loc,action,note,view,keys}));
export const PARTS=['全部','胸肩','背部','手臂','核心','臀腿','颈部'];
export function normalize(name){return name.replace(/_/g,' ').replace(/\s+/g,' ').trim();}
export function groupFor(name){
 const n=normalize(name);
 // Prefer specific subdivisions over their whole-muscle groups when clicking.
 return GROUPS.find(g=>['chest-upper','chest-lower','traps-upper'].includes(g.id)&&g.pattern.test(n))||GROUPS.find(g=>g.pattern.test(n));
}
const translations={
 'abdominal part':'腹部','clavicular part':'锁骨部','sternocostal part':'胸肋部','acromial part':'肩峰部','spinal part':'肩胛冈部','descending part':'上部','transverse part':'中部','ascending part':'下部','long head':'长头','short head':'短头','lateral head':'外侧头','medial head':'内侧头',
 'rectus femoris':'股直肌','vastus lateralis':'股外侧肌','vastus medialis':'股内侧肌','vastus intermedius':'股中间肌','biceps femoris':'股二头肌','semitendinosus':'半腱肌','semimembranosus':'半膜肌','rhomboid major':'大菱形肌','rhomboid minor':'小菱形肌','supraspinatus':'冈上肌','infraspinatus muscle':'冈下肌','subscapularis':'肩胛下肌','teres minor':'小圆肌','pectoralis major':'胸大肌','pectoralis minor':'胸小肌','deltoid':'三角肌','trapezius':'斜方肌','latissimus dorsi':'背阔肌','biceps brachii':'肱二头肌','triceps brachii':'肱三头肌','brachioradialis':'肱桡肌','brachialis':'肱肌','serratus anterior':'前锯肌','gluteus maximus':'臀大肌','gluteus medius':'臀中肌','gluteus minimus':'臀小肌','gastrocnemius':'腓肠肌','soleus':'比目鱼肌','rectus abdominis':'腹直肌','external oblique':'腹外斜肌','internal oblique':'腹内斜肌','transversus abdominis':'腹横肌','sternocleidomastoid':'胸锁乳突肌','levator scapulae':'肩胛提肌','teres major':'大圆肌','sartorius':'缝匠肌','tibialis anterior':'胫骨前肌','tibialis posterior':'胫骨后肌','iliacus':'髂肌','psoas major':'腰大肌','quadratus lumborum':'腰方肌','adductor longus':'长收肌','adductor brevis':'短收肌','adductor magnus':'大收肌','adductor minimus':'小收肌','pectineus':'耻骨肌','gracilis':'股薄肌','anconeus':'肘肌','coracobrachialis':'喙肱肌','piriformis':'梨状肌','obturator internus':'闭孔内肌','obturator externus':'闭孔外肌','gemellus superior':'上孖肌','gemellus inferior':'下孖肌','quadratus femoris':'股方肌','popliteus':'腘肌','plantaris':'跖肌','fibularis longus':'腓骨长肌','fibularis brevis':'腓骨短肌','fibularis tertius':'第三腓骨肌','diaphragm':'膈肌','external intercostal muscle':'肋间外肌','internal intercostal muscle':'肋间内肌','innermost intercostal muscle':'肋间最内肌','transversus thoracis':'胸横肌','serratus posterior superior':'上后锯肌','serratus posterior inferior':'下后锯肌','subclavius':'锁骨下肌','longus capitis':'头长肌','splenius capitis':'头夹肌','splenius cervicis':'颈夹肌','iliocostalis cervicis':'颈髂肋肌','iliocostalis thoracis':'胸髂肋肌','iliocostalis lumborum':'腰髂肋肌','longissimus capitis':'头最长肌','longissimus cervicis':'颈最长肌','longissimus thoracis':'胸最长肌','spinalis thoracis':'胸棘肌','spinalis':'棘肌','multifidus cervicis':'颈多裂肌','multifidus thoracis':'胸多裂肌','multifidus lumborum':'腰多裂肌','rotatores':'回旋肌','semispinalis capitis':'头半棘肌','semispinalis cervicis':'颈半棘肌','semispinalis thoracis':'胸半棘肌','platysma':'颈阔肌','temporalis':'颞肌','superficial part of masseter':'咬肌浅部','deep part of masseter':'咬肌深部','frontalis':'额肌','orbicularis oris':'口轮匝肌','orbital part of orbicularis oculi':'眼轮匝肌眶部','palpebral part of orbicularis oculi':'眼轮匝肌睑部','zygomaticus major':'颧大肌','zygomaticus minor':'颧小肌','mentalis':'颏肌','risorius':'笑肌','nasalis':'鼻肌','procerus':'降眉间肌','corrugator supercilii':'皱眉肌','levator labii superioris':'上唇提肌','depressor labii inferioris':'下唇降肌','depressor anguli oris':'降口角肌','flexor carpi radialis':'桡侧腕屈肌','extensor carpi radialis longus':'桡侧腕长伸肌','extensor carpi radialis brevis':'桡侧腕短伸肌','extensor carpi ulnaris':'尺侧腕伸肌','palmaris longus':'掌长肌','flexor digitorum profundus':'指深屈肌','flexor digitorum superficialis':'指浅屈肌','flexor pollicis longus':'拇长屈肌','extensor digitorum':'指伸肌','extensor indicis':'示指伸肌','extensor pollicis longus':'拇长伸肌','extensor pollicis brevis':'拇短伸肌','extensor digiti minimi':'小指伸肌','abductor pollicis longus':'拇长展肌','supinator':'旋后肌','pronator quadratus':'旋前方肌','extensor digitorum longus':'趾长伸肌','extensor hallucis longus':'拇长伸肌（足）','flexor digitorum longus':'趾长屈肌','flexor hallucis longus':'拇长屈肌（足）','flexor digitorum brevis':'趾短屈肌','abductor hallucis':'拇展肌（足）','extensor hallucis brevis':'拇短伸肌（足）','flexor accessorius':'足底方肌','sternohyoid':'胸骨舌骨肌','sternothyroid':'胸骨甲状肌','thyrohyoid':'甲状舌骨肌','omohyoid':'肩胛舌骨肌','digastric':'二腹肌','mylohyoid':'下颌舌骨肌','geniohyoid':'颏舌骨肌','stylohyoid':'茎突舌骨肌','scalenus anterior':'前斜角肌','scalenus medius':'中斜角肌','scalenus posterior':'后斜角肌'
};
export function structureName(raw){
 const n=normalize(raw).replace(/\s*\(\d+\)$/,'');
 const side=/\bleft\b/.test(n)?'左侧 · ':/\bright\b/.test(n)?'右侧 · ':'';
 const clean=n.replace(/\b(left|right)\s*/g,'');
 if(translations[clean]) return side+translations[clean];
 const match=clean.match(/^(.+?) (?:of )?(.+)$/);
 for(const [qualifier,zh] of Object.entries(translations)){
   if(clean.startsWith(qualifier+' of ')){
     const body=clean.slice(qualifier.length+4);
     if(translations[body]) return side+translations[body]+' · '+zh;
   }
 }
 return side+clean;
}
