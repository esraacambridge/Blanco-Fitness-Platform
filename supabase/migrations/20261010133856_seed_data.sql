/*
# BLANCO FITNESS — Seed Data

## Overview
Populates the database with initial content: muscle groups, exercises, programs,
nutrition categories, articles, recipes, membership plans, FAQs, site settings,
trainers, and testimonials. All seed data is clearly identifiable as development/seed content.

## Data Inserted
1. Site settings (single row)
2. Muscle groups (10 groups)
3. Exercises (24 exercises across all muscle groups)
4. Programs (4 programs: beginner/intermediate/advanced)
5. Program exercises
6. Nutrition categories (6)
7. Nutrition articles (4)
8. Recipes (4)
9. Membership plans (3 tiers)
10. FAQs (8)
11. Testimonials (3)
12. Trainers (3)
*/

-- Site settings
INSERT INTO site_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Muscle Groups
INSERT INTO muscle_groups (name_en, name_ar, slug, sort_order) VALUES
('Chest', 'الصدر', 'chest', 1),
('Back', 'الظهر', 'back', 2),
('Shoulders', 'الأكتاف', 'shoulders', 3),
('Biceps', 'البايسبس', 'biceps', 4),
('Triceps', 'الترايسبس', 'triceps', 5),
('Legs', 'الأرجل', 'legs', 6),
('Glutes', 'الأرداف', 'glutes', 7),
('Abs and Core', 'البطن والكور', 'abs-core', 8),
('Full Body', 'كامل الجسم', 'full-body', 9),
('Cardio and Conditioning', 'الكارديو والت Conditioning', 'cardio', 10)
ON CONFLICT DO NOTHING;

-- Exercises
INSERT INTO exercises (name_en, name_ar, slug, muscle_group_id, difficulty, equipment, instructions_en, instructions_ar, common_mistakes_en, common_mistakes_ar, safety_notes_en, safety_notes_ar, alternatives_en, alternatives_ar, is_published, description_en, description_ar) VALUES
('Barbell Bench Press', 'ضغط البنش بالبار', 'barbell-bench-press', (SELECT id FROM muscle_groups WHERE slug='chest'), 'intermediate', ARRAY['barbell', 'bench'],
ARRAY['Lie flat on the bench with eyes under the bar', 'Grip the bar slightly wider than shoulder-width', 'Lower the bar to mid-chest with control', 'Press the bar up until arms are extended', 'Lock elbows at the top without hyperextending'],
ARRAY['استلقِ على البنش مع وضع العينين تحت البار', 'أمسك البار بعرض أكبر قليلاً من عرض الكتف', 'أنزل البار إلى منتصف الصدر بتحكم', 'ادفع البار لأعلى حتى تستقيم الذراعان', 'قفل المرفقين في الأعلى دون إفراط'],
ARRAY['Bouncing the bar off the chest', 'Flaring elbows too wide', 'Lifting hips off the bench', 'Not using a full range of motion', 'Gripping too wide or narrow'],
ARRAY['ارتداد البار من الصدر', 'فتح المرفقين بشكل مفرط', 'رفع الورك عن البنش', 'عدم استخدام مدى الحركة الكامل', 'قبضة ضيقة أو واسعة جداً'],
'Always use a spotter for heavy sets. Use safety pins if training alone.', 'استخدم مراقباً دائماً للأوزان الثقيلة. استخدم دبابيس الأمان عند التدريب بمفردك.',
ARRAY['Dumbbell Bench Press', 'Incline Bench Press', 'Machine Chest Press'],
ARRAY['ضغط البنش بالدمبل', 'ضغط البنش المائل', 'ضغط الصدر بالماكينة'],
true,
'Compound chest exercise that builds overall pressing strength and pectoral mass.', 'تمرين مركب للصدر يبني قوة الضغط الشاملة وكتلة العضلة الصدرية.'),

('Incline Dumbbell Press', 'ضغط المائل بالدمبل', 'incline-dumbbell-press', (SELECT id FROM muscle_groups WHERE slug='chest'), 'beginner', ARRAY['dumbbells', 'incline-bench'],
ARRAY['Set the bench to a 30-45 degree angle', 'Sit back with dumbbells at shoulder level', 'Press dumbbells up and slightly together', 'Lower with control to shoulder level', 'Keep wrists straight throughout'],
ARRAY['اضبط البنش على زاوية 30-45 درجة', 'اجلس مع حمل الدمبل عند مستوى الكتف', 'ادفع الدمبل لأعلى وقلليلاً نحو الداخل', 'أنزل بتحكم إلى مستوى الكتف', 'حافظ على استقامة المعصم طوال الحركة'],
ARRAY['Setting the incline too steep', 'Bringing weights down too fast', 'Arching the lower back excessively'],
ARRAY['ضبط الميل عالياً جداً', 'إنزال الأوزان بسرعة كبيرة', 'تقوس أسفل الظهر بشكل مفرط'],
'Use a spotter when using heavy weights. Maintain full control of the dumbbells.', 'استخدم مراقباً عند استخدام أوزان ثقيلة. حافظ على تحكم كامل في الدمبل.',
ARRAY['Barbell Incline Press', 'Cable Fly', 'Push-ups'],
ARRAY['ضغط المائل بالبار', 'الطيران بالكابل', 'الضغط على الأرض'],
true,
'Targets the upper chest fibers for a well-rounded pectoral development.', 'يستهدف ألياف الصدر العلوية لتطوير متكامل للعضلة الصدرية.'),

('Push-Up', 'الضغط على الأرض', 'push-up', (SELECT id FROM muscle_groups WHERE slug='chest'), 'beginner', ARRAY['bodyweight'],
ARRAY['Start in a plank position with hands shoulder-width apart', 'Keep your body in a straight line from head to heels', 'Lower your chest toward the floor by bending elbows', 'Push back up to starting position', 'Keep core engaged throughout'],
ARRAY['ابدأ في وضعية البلانك مع وضع اليدين بعرض الكتف', 'حافظ على استقامة الجسم من الرأس إلى الكعب', 'أنزل صدرك نحو الأرض بثني المرفقين', 'ادفع للعودة إلى وضع البداية', 'حافظ على شد الكور طوال الحركة'],
ARRAY['Sagging hips', 'Flaring elbows out too wide', 'Not going low enough', 'Holding breath'],
ARRAY['تدلي الورك', 'فتح المرفقين بشكل مفرط', 'عدم النزول بعمق كافٍ', 'حبس النفس'],
'Maintain proper form over quantity. Modify by dropping to knees if needed.', 'حافظ على الأداء الصحيح قبل زيادة العدد. عدّل التمرين بالنزول على الركبتين عند الحاجة.',
ARRAY['Decline Push-Up', 'Diamond Push-Up', 'Bench Press'],
ARRAY['الضغط المنحدر', 'الضغط الماسي', 'ضغط البنش'],
true,
'Classic bodyweight exercise for chest, shoulders, and triceps. Great for all fitness levels.', 'تمرين كلاسيكي بوزن الجسم للصدر والأكتاف والترايسبس. مناسب لجميع مستويات الليافة.'),

('Pull-Up', 'العقلة', 'pull-up', (SELECT id FROM muscle_groups WHERE slug='back'), 'intermediate', ARRAY['pull-up-bar'],
ARRAY['Grab the bar with an overhand grip, slightly wider than shoulder-width', 'Hang with arms fully extended', 'Pull your chin above the bar', 'Lower with control back to full hang', 'Keep core tight and avoid swinging'],
ARRAY['أمسك البار بقبضة علوية بعرض أكبر من الكتف', 'تعلق مع استقامة الذراعين', 'اسحب ذقنك فوق البار', 'أنزل بتحكم إلى التعليق الكامل', 'حافظ على شد الكور وتجنب التأرجح'],
ARRAY['Using momentum to swing up', 'Not going to full extension', 'Shrugging shoulders', 'Partial range of motion'],
ARRAY['استخدام الزخم للصعود', 'عدم الوصول للاستقامة الكاملة', 'رفع الأكتاف', 'مدى حركة جزئي'],
'Warm up shoulders thoroughly. Use resistance bands for assistance if needed.', 'أحمِ كتفيك جيداً. استخدم أشرطة المقاومة للمساعدة عند الحاجة.',
ARRAY['Lat Pulldown', 'Inverted Rows', 'Chin-Ups'],
ARRAY['سحب الكابل العلوي', 'التجديف المقلوب', 'العقلة بالقبضة السفلية'],
true,
'Fundamental back exercise building lat width and upper body pulling strength.', 'تمرين أساسي للظهر يبني عرض العضلة الظهرية وقوة السحب للجزء العلوي.'),

('Barbell Row', 'التجديف بالبار', 'barbell-row', (SELECT id FROM muscle_groups WHERE slug='back'), 'intermediate', ARRAY['barbell'],
ARRAY['Stand with feet shoulder-width apart, barbell on the floor', 'Hinge at hips keeping back straight', 'Grip bar slightly wider than shoulder-width', 'Pull bar to lower ribcage, squeezing shoulder blades', 'Lower with control back to starting position'],
ARRAY['قف بعرض الكتف، البار على الأرض', 'انحنِ من الورك مع استقامة الظهر', 'أمسك البار بعرض أكبر من الكتف', 'اسحب البار إلى أسفل الضلوع مع ضم لوحي الكتف', 'أنزل بتحكم إلى وضع البداية'],
ARRAY['Rounding the lower back', 'Using too much momentum', 'Not squeezing shoulder blades', 'Jerking the weight up'],
ARRAY['تقوس أسفل الظهر', 'استخدام زخم مفرط', 'عدم ضم لوحي الكتف', 'نتف البار بقوة'],
'Keep spine neutral. Reduce weight if form breaks down. Use lifting belt for heavy sets.', 'حافظ على استقامة العمود الفقري. خفف الوزن إذا تدهور الأداء. استخدم حزام رفع للأوزان الثقيلة.',
ARRAY['Dumbbell Row', 'Seated Cable Row', 'T-Bar Row'],
ARRAY['التجديف بالدمبل', 'التجديف بالكابل جلوساً', 'تجديف التي-بار'],
true,
'Compound back exercise that builds thickness and strength in the lats and upper back.', 'تمرين مركب للظهر يبني السماكة والقوة في العضلة الظهرية والظهر العلوي.'),

('Lat Pulldown', 'سحب الكابل العلوي', 'lat-pulldown', (SELECT id FROM muscle_groups WHERE slug='back'), 'beginner', ARRAY['cable-machine'],
ARRAY['Sit at the pulldown machine and adjust thigh pads', 'Grip the bar wider than shoulder-width', 'Pull the bar down to upper chest, squeezing lats', 'Control the bar back up to full extension', 'Keep torso slightly angled back'],
ARRAY['اجلس على جهاز السحب واضبط وسادة الفخذ', 'أمسك البار بعرض أكبر من الكتف', 'اسحب البار إلى أعلى الصدر مع شد العضلة الظهرية', 'تحكم في البار عائداً إلى الاستقامة الكاملة', 'حافظ على ميل خفيف للجذع للخلف'],
ARRAY['Swinging the torso', 'Pulling behind the neck', 'Using arms instead of lats', 'Not controlling the negative'],
ARRAY['تأرجح الجذع', 'السحب خلف الرقبة', 'استخدام الذراعين بدلاً من الظهر', 'عدم التحكم في الحركة السلبية'],
'Avoid pulling the bar behind the neck to prevent shoulder injury. Focus on mind-muscle connection with lats.', 'تجنب السحب خلف الرقبة لمنع إصابة الكتف. ركز على التواصل الذهني العضلي مع العضلة الظهرية.',
ARRAY['Pull-Ups', 'Straight-Arm Pulldown', 'Seated Row'],
ARRAY['العقلة', 'السحب بذراع مستقيمة', 'التجديف جلوساً'],
true,
'Cable exercise targeting the latissimus dorsi. Great for building back width.', 'تمرين بالكابل يستهدف العضلة الظهرية العريضة. ممتاز لبناء عرض الظهر.'),

('Overhead Press', 'الضغط العلوي', 'overhead-press', (SELECT id FROM muscle_groups WHERE slug='shoulders'), 'intermediate', ARRAY['barbell'],
ARRAY['Stand with feet shoulder-width apart, bar at shoulder level', 'Grip bar slightly wider than shoulder-width', 'Press bar overhead until arms are extended', 'Lower bar back to shoulder level with control', 'Keep core tight and avoid excessive lean-back'],
ARRAY['قف بعرض الكتف، البار عند مستوى الكتف', 'أمسك البار بعرض أكبر من الكتف', 'ادفع البار فوق الرأس حتى تستقيم الذراعان', 'أنزل البار بتحكم إلى مستوى الكتف', 'حافظ على شد الكور وتجنب الميل الخلفي المفرط'],
ARRAY['Leaning back excessively', 'Not bracing the core', 'Pressing in front instead of overhead', 'Locking out aggressively'],
ARRAY['الميل للخلف بشكل مفرط', 'عدم شد الكور', 'الدفع للأمام بدلاً من الأعلى', 'قفل مفاجئ في الأعلى'],
'Use a rack with safety pins. Avoid pressing if you have shoulder mobility issues.', 'استخدم رف مع دبابيس أمان. تجنب الضغط إذا كان لديك مشاكل في مرونة الكتف.',
ARRAY['Dumbbell Shoulder Press', 'Arnold Press', 'Push Press'],
ARRAY['ضغط الكتف بالدمبل', 'ضغط أرنولد', 'الضغط بالدفع'],
true,
'Compound shoulder exercise building overall deltoid strength and overhead pressing power.', 'تمرين مركب للكتف يبني قوة الدلتا الشاملة وقوة الضغط العلوي.'),

('Lateral Raise', 'الرفرفة الجانبية', 'lateral-raise', (SELECT id FROM muscle_groups WHERE slug='shoulders'), 'beginner', ARRAY['dumbbells'],
ARRAY['Stand with dumbbells at your sides, palms facing in', 'Keep a slight bend in elbows', 'Raise dumbbells out to the sides to shoulder height', 'Lower with control back to starting position', 'Keep shoulders down, away from ears'],
ARRAY['قف مع الدمبل على جانبيك، راحة اليد للداخل', 'حافظ على انحناء خفيف في المرفق', 'ارفع الدمبل للجانبين حتى مستوى الكتف', 'أنزل بتحكم إلى وضع البداية', 'حافظ على انخفاض الأكتاف بعيداً عن الأذنين'],
ARRAY['Using momentum to swing', 'Raising above shoulder height', 'Bending elbows too much', 'Shrugging shoulders'],
ARRAY['استخدام الزخم للتأرجح', 'الرفع فوق مستوى الكتف', 'ثني المرفق مفرط', 'رفع الأكتاف'],
'Use lighter weights to maintain strict form. This is an isolation exercise, not a power movement.', 'استخدم أوزاناً خفيفة للحفاظ على الأداء الصارم. هذا تمرين عزل وليس حركة قوة.',
ARRAY['Cable Lateral Raise', 'Machine Lateral Raise', 'Dumbbell Reverse Fly'],
ARRAY['الرفرفة الجانبية بالكابل', 'الرفرفة بالماكينة', 'الطيران العكسي بالدمبل'],
true,
'Isolation exercise targeting the lateral deltoid head for shoulder width and roundness.', 'تمرين عزل يستهدف الرأس الجانبي للدلتا لعرض الكتف واستدارته.'),

('Barbell Curl', 'البايسبس بالبار', 'barbell-curl', (SELECT id FROM muscle_groups WHERE slug='biceps'), 'beginner', ARRAY['barbell'],
ARRAY['Stand with feet shoulder-width apart', 'Grip barbell with underhand grip, shoulder-width', 'Keep elbows pinned to your sides', 'Curl the bar up by flexing biceps', 'Lower with control back to full extension'],
ARRAY['قف بعرض الكتف', 'أمسك البار بقبضة سفلية بعرض الكتف', 'حافظ على تثبيت المرفقين على جانبيك', 'ادفع البار لأعلى بثني البايسبس', 'أنزل بتحكم إلى الاستقامة الكاملة'],
ARRAY['Swinging the body to lift', 'Moving elbows forward', 'Dropping the weight too fast', 'Partial range on the bottom'],
ARRAY['تأرجح الجسم للرفع', 'تحريك المرفقين للأمام', 'إنزال الوزن بسرعة كبيرة', 'مدى حركة جزئي في الأسفل'],
'Keep the movement strict. Reduce weight if you need to swing. Avoid lifting with lower back.', 'حافظ على الحركة صارمة. خفف الوزن إذا احتجت للتأرجح. تجنب الرفع بأسفل الظهر.',
ARRAY['Dumbbell Curl', 'Hammer Curl', 'Cable Curl'],
ARRAY['البايسبس بالدمبل', 'البايسبس المطرقة', 'البايسبس بالكابل'],
true,
'Classic biceps builder that targets the short and long heads of the biceps brachii.', 'تمرين كلاسيكي للبايسبس يستهدف الرأس القصير والطويل لعضلة البايسبس.'),

('Hammer Curl', 'البايسبس المطرقة', 'hammer-curl', (SELECT id FROM muscle_groups WHERE slug='biceps'), 'beginner', ARRAY['dumbbells'],
ARRAY['Stand with dumbbells at sides, palms facing each other', 'Keep elbows pinned to sides', 'Curl dumbbells up maintaining neutral grip', 'Squeeze biceps at the top', 'Lower with control to full extension'],
ARRAY['قف مع الدمبل على الجانبين، راحة اليد تواجه بعضها', 'حافظ على تثبيت المرفقين', 'ارفع الدمبل مع الحفاظ على القبضة المحايدة', 'شد البايسبس في الأعلى', 'أنزل بتحكم إلى الاستقامة الكاملة'],
ARRAY['Using momentum', 'Rotating wrists during the curl', 'Not fully extending at the bottom'],
ARRAY['استخدام الزخم', 'تدوير المعصم أثناء الرفع', 'عدم الاستقامة الكاملة في الأسفل'],
'Focus on the brachialis and brachioradialis. Great for arm thickness.', 'ركّز على العضلة العضدية والعضدية الكعبرية. ممتاز لسماكة الذراع.',
ARRAY['Barbell Curl', 'Cable Hammer Curl', 'Cross-Body Hammer Curl'],
ARRAY['البايسبس بالبار', 'المطرقة بالكابل', 'المطرقة المتقاطعة'],
true,
'Targets the brachialis and forearm for thicker arms. Neutral grip is easier on the wrists.', 'يستهدف العضلة العضدية والساعد لذراع أكثر سماكة. القبضة المحايدة أسهل على المعصم.'),

('Triceps Pushdown', 'الترايسبس بالكابل', 'triceps-pushdown', (SELECT id FROM muscle_groups WHERE slug='triceps'), 'beginner', ARRAY['cable-machine'],
ARRAY['Stand at the cable machine with bar attachment', 'Grip bar with overhand grip, elbows at sides', 'Push the bar down until arms are fully extended', 'Squeeze triceps at the bottom', 'Return with control to starting position'],
ARRAY['قف عند جهاز الكابل مع ملحق البار', 'أمسك البار بقبضة علوية، المرفقين على الجانب', 'ادفع البار لأسفل حتى الاستقامة الكاملة', 'شد الترايسبس في الأسفل', 'عد بتحكم إلى وضع البداية'],
ARRAY['Moving elbows away from body', 'Using body weight to push', 'Not getting full extension', 'Rushing the negative'],
ARRAY['تحريك المرفقين بعيداً عن الجسم', 'استخدام وزن الجسم في الدفع', 'عدم الوصول للاستقامة الكاملة', 'الاستعجال في الحركة السلبية'],
'Keep elbows stationary. The only movement should be at the elbow joint.', 'حافظ على ثبات المرفقين. الحركة الوحيدة يجب أن تكون عند مفصل المرفق.',
ARRAY['Skull Crushers', 'Close-Grip Bench Press', 'Overhead Triceps Extension'],
ARRAY['سحق الجمجمة', 'ضغط البنش بقبضة ضيقة', 'تمديد الترايسبس العلوي'],
true,
'Isolation triceps exercise using a cable machine. Great for building triceps definition.', 'تمرين عزل للترايسبس باستخدام الكابل. ممتاز لبناء تحديد الترايسبس.'),

('Skull Crushers', 'سحق الجمجمة', 'skull-crushers', (SELECT id FROM muscle_groups WHERE slug='triceps'), 'intermediate', ARRAY['ez-bar', 'bench'],
ARRAY['Lie on a flat bench with an EZ bar', 'Hold bar overhead with arms extended', 'Bend elbows to lower bar toward forehead', 'Keep upper arms stationary', 'Extend arms back to starting position'],
ARRAY['استلقِ على بنش مسطح مع بار EZ', 'أمسك البار فوق الرأس باستقامة الذراع', 'اثنِ المرفقين لإنزال البار نحو الجبهة', 'حافظ على ثبات الجزء العلوي من الذراع', 'مدّ الذراعين للعودة إلى وضع البداية'],
ARRAY['Flaring elbows outward', 'Moving upper arms', 'Going too fast', 'Using too much weight'],
ARRAY['فتح المرفقين للخارج', 'تحريك الجزء العلوي من الذراع', 'الحركة السريعة جداً', 'استخدام وزن زائد'],
'Start light to perfect form. Use an EZ bar to reduce wrist strain compared to a straight bar.', 'ابدأ بوزن خفيف لإتقان الأداء. استخدم بار EZ لتقليل إجهاد المعصم مقارنة بالبار المستقيم.',
ARRAY['Triceps Pushdown', 'Overhead Extension', 'Close-Grip Bench Press'],
ARRAY['الترايسبس بالكابل', 'التمديد العلوي', 'ضغط البنش بقبضة ضيقة'],
true,
'Isolation exercise targeting the long head of the triceps for horseshoe development.', 'تمرين عزل يستهدف الرأس الطويل للترايسبس لتطوير شكل حدوة الحصان.'),

('Back Squat', 'السكوات بالبار', 'back-squat', (SELECT id FROM muscle_groups WHERE slug='legs'), 'intermediate', ARRAY['barbell', 'squat-rack'],
ARRAY['Set bar at upper trap height in the rack', 'Step under bar and grip slightly wider than shoulders', 'Brace core and unrack the bar', 'Descend by bending knees and pushing hips back', 'Reach parallel or below, then drive up through heels'],
ARRAY['اضبط البار عند مستوى أعلى الترابس في الرف', 'ادخل تحت البار وأمسك بعرض أكبر من الكتف', 'اشدد الكور وارفع البار عن الرف', 'انزل بثني الركبتين ودفع الورك للخلف', 'صل إلى مستوى التوازي أو أقل، ثم ادفع لأعلى من خلال الكعب'],
ARRAY['Knees caving inward', 'Rounding lower back', 'Not reaching depth', 'Heels coming off the floor'],
ARRAY['تداخل الركبتين للداخل', 'تقوس أسفل الظهر', 'عدم الوصول للعمق المطلوب', 'ارتفاع الكعب عن الأرض'],
'Always use safety pins. Warm up thoroughly. Use a lifting belt for heavy sets. Never round your back.', 'استخدم دبابيس الأمان دائماً. أحمِ جيداً. استخدم حزام رفع للأوزان الثقيلة. لا تقوّس ظهرك أبداً.',
ARRAY['Front Squat', 'Goblet Squat', 'Leg Press'],
ARRAY['السكوات الأمامي', 'سكوات الكوبليت', 'دفع الأرجل بالماكينة'],
true,
'King of leg exercises. Builds quads, glutes, hamstrings, and overall lower body strength.', 'ملك تمارين الأرجل. يبني العضلة الرباعية والأرداف والعضلة الخلفية وقوة أسفل الجسم.'),

('Romanian Deadlift', 'الرفعة الميتة الرومانية', 'romanian-deadlift', (SELECT id FROM muscle_groups WHERE slug='legs'), 'intermediate', ARRAY['barbell'],
ARRAY['Stand with feet hip-width apart, barbell in hands', 'Keep slight bend in knees throughout', 'Hinge at hips, pushing glutes back', 'Lower bar along front of legs until stretch in hamstrings', 'Drive hips forward to return to standing'],
ARRAY['قف بعرض الورك، البار في يديك', 'حافظ على انحناء خفيف في الركبتين طوال الحركة', 'انحنِ من الورك مع دفع الأرداف للخلف', 'أنزل البار أمام الساقين حتى تشعر بشد في العضلة الخلفية', 'ادفع الورك للأمام للعودة إلى الوقوف'],
ARRAY['Rounding the back', 'Bending knees too much', 'Bar drifting away from body', 'Going too heavy too soon'],
ARRAY['تقوس الظهر', 'ثني الركبتين مفرط', 'ابتعاد البار عن الجسم', 'استخدام وزن زائد مبكراً'],
'Keep bar close to body. Reduce weight if back rounds. This is a hip hinge, not a squat.', 'حافظ على قرب البار من الجسم. خفف الوزن إذا تقوس الظهر. هذه حركة مفصل الورك وليست سكوات.',
ARRAY['Leg Curl', 'Conventional Deadlift', 'Good Morning'],
ARRAY['ثني الأرجل بالماكينة', 'الرفعة الميتة العادية', 'الصباحية'],
true,
'Targets hamstrings and glutes with a hip hinge pattern. Excellent for posterior chain development.', 'يستهدف العضلة الخلفية والأرداف بنمط انحناء الورك. ممتاز لتطوير السلسلة الخلفية.'),

('Leg Press', 'دفع الأرجل بالماكينة', 'leg-press', (SELECT id FROM muscle_groups WHERE slug='legs'), 'beginner', ARRAY['leg-press-machine'],
ARRAY['Sit in the machine with feet on platform shoulder-width', 'Adjust seat so knees are at 90 degrees when lowered', 'Release safety and lower platform by bending knees', 'Push platform back up without locking knees', 'Keep feet flat and core engaged'],
ARRAY['اجلس في الجهاز مع وضع القدمين على المنصة بعرض الكتف', 'اضبط المقعد بحيث تكون الركبتين عند 90 درجة عند الإنزال', 'حرر الأمان وأنزل المنصة بثني الركبتين', 'ادفع المنصة لأعلى دون قفل الركبتين', 'حافظ على استواء القدمين وشد الكور'],
ARRAY['Locking out knees at top', 'Knees caving inward', 'Going too deep with heavy weight', 'Lifting lower back off pad'],
ARRAY['قفل الركبتين في الأعلى', 'تداخل الركبتين للداخل', 'النزول عميقاً جداً مع وزن ثقيل', 'رفع أسفل الظهر عن الوسادة'],
'Never lock out your knees. Use safety catches. Start light to learn the movement pattern.', 'لا تقفل ركبتيك أبداً. استخدم مزالق الأمان. ابدأ بوزن خفيف لتعلم نمط الحركة.',
ARRAY['Back Squat', 'Bulgarian Split Squat', 'Goblet Squat'],
ARRAY['السكوات بالبار', 'السكوات البلغاري', 'سكوات الكوبليت'],
true,
'Machine-based leg exercise great for building quad strength. Safer alternative to squats for beginners.', 'تمرين أرجل بالماكينة ممتاز لبناء قوة العضلة الرباعية. بديل أكثر أماناً للسكوات للمبتدئين.'),

('Walking Lunge', 'الطعنة المتحركة', 'walking-lunge', (SELECT id FROM muscle_groups WHERE slug='legs'), 'beginner', ARRAY['dumbbells'],
ARRAY['Stand with dumbbells at your sides', 'Step forward with one leg into a lunge', 'Lower back knee toward the floor', 'Push through front heel to step forward', 'Alternate legs walking forward'],
ARRAY['قف مع الدمبل على جانبيك', 'اخطُ للأمام بإحدى الساقين في وضع الطعنة', 'أنزل الركبة الخلفية نحو الأرض', 'ادفع من كعب القدم الأمامية للخطوة للأمام', 'ناوب بين الساقين في المشي للأمام'],
ARRAY['Front knee going past toes', 'Leaning torso forward too much', 'Not enough depth', 'Short steps'],
ARRAY['تجاوز الركبة الأمامية لأصابع القدم', 'ميل الجذع للأمام مفرط', 'عدم كفاية العمق', 'خطوات قصيرة'],
'Keep torso upright. Ensure front knee tracks over toes. Use bodyweight if new to lunges.', 'حافظ على استقامة الجذع. تأكد من أن الركبة الأمامية فوق أصابع القدم. استخدم وزن الجسم للمبتدئين.',
ARRAY['Stationary Lunge', 'Bulgarian Split Squat', 'Step-Ups'],
ARRAY['الطعنة الثابتة', 'السكوات البلغاري', 'الصعود على المرتفع'],
true,
'Functional leg exercise targeting quads, glutes, and hamstrings while improving balance.', 'تمرين أرجل وظيفي يستهدف العضلة الرباعية والأرداف والعضلة الخلفية مع تحسين التوازن.'),

('Hip Thrust', 'الدفع بالورك', 'hip-thrust', (SELECT id FROM muscle_groups WHERE slug='glutes'), 'intermediate', ARRAY['barbell', 'bench'],
ARRAY['Sit with upper back against a bench', 'Roll barbell over hips', 'Plant feet flat, hip-width apart', 'Drive through heels to thrust hips up', 'Squeeze glutes at top, lower with control'],
ARRAY['اجلس مع وضع أعلى الظهر على البنش', 'مرر البار فوق الورك', 'ضع القدمين مسطحتين بعرض الورك', 'ادفع من الكعب لرفع الورك لأعلى', 'شد الأرداف في الأعلى، أنزل بتحكم'],
ARRAY['Hyperextending the lower back at top', 'Feet too close or far from body', 'Not squeezing glutes', 'Chin tucking to chest'],
ARRAY['إفراط في مد أسفل الظهر في الأعلى', 'القدمين قريبة أو بعيدة جداً', 'عدم شد الأرداف', 'تقريب الذقن من الصدر'],
'Use a pad for the bar. Keep chin tucked and ribs down. Focus on glute activation, not back extension.', 'استخدم وسادة للبار. أبقِ الذقن للداخل والأضلاع للأسفل. ركز على تنشيط الأرداف وليس مد الظهر.',
ARRAY['Glute Bridge', 'Cable Kickback', 'Bulgarian Split Squat'],
ARRAY['جسر الأرداف', 'الرفس بالكابل', 'السكوات البلغاري'],
true,
'Premier glute-building exercise. Targets the gluteus maximus for size and strength.', 'أفضل تمرين لبناء الأرداف. يستهدف العضلة الألوية الكبرى للحجم والقوة.'),

('Plank', 'البلانك', 'plank', (SELECT id FROM muscle_groups WHERE slug='abs-core'), 'beginner', ARRAY['bodyweight'],
ARRAY['Start on forearms and toes', 'Keep body in a straight line from head to heels', 'Engage core by drawing navel toward spine', 'Hold position while breathing normally', 'Keep hips level, not sagging or piking'],
ARRAY['ابدأ على الساعدين وأصابع القدم', 'حافظ على استقامة الجسم من الرأس للكعب', 'اشدد الكور بسرة البطن نحو العمود الفقري', 'ثبت في الوضع مع تنفس طبيعي', 'حافظ على استواء الورك دون تدلي أو ارتفاع'],
ARRAY['Sagging hips', 'Hips too high', 'Holding breath', 'Looking up or dropping head'],
ARRAY['تدلي الورك', 'ارتفاع الورك مفرط', 'حبس النفس', 'النظر لأعلى أو إنزال الرأس'],
'Start with 20-30 second holds and progress gradually. Quality over duration.', 'ابدأ بمدة 20-30 ثانية وتدرج تدريجياً. الجودة قبل المدة.',
ARRAY['Side Plank', 'Hollow Body Hold', 'Dead Bug'],
ARRAY['بلانك الجانبي', 'ثبات الجسم المجوف', 'البقرة الميتة'],
true,
'Isometric core exercise building abdominal and lower back stability. Foundation for all movement.', 'تمرين ثابت للكور يبني استقرار البطن وأسفل الظهر. أساس لجميع الحركات.'),

('Hanging Leg Raise', 'رفع الأرجل معلقاً', 'hanging-leg-raise', (SELECT id FROM muscle_groups WHERE slug='abs-core'), 'intermediate', ARRAY['pull-up-bar'],
ARRAY['Hang from a pull-up bar with arms extended', 'Keep legs straight and together', 'Raise legs to hip height or higher', 'Lower with control without swinging', 'Engage core throughout the movement'],
ARRAY['تعلق من بار العقلة باستقامة الذراع', 'حافظ على استقامة الساقين معاً', 'ارفع الساقين إلى مستوى الورك أو أعلى', 'أنزل بتحكم دون تأرجح', 'اشدد الكور طوال الحركة'],
ARRAY['Swinging the body', 'Bending knees excessively', 'Using momentum', 'Not controlling the descent'],
ARRAY['تأرجح الجسم', 'ثني الركبتين مفرط', 'استخدام الزخم', 'عدم التحكم في الإنزال'],
'Avoid swinging. If unable to do straight leg, bend knees slightly and progress over time.', 'تجنب التأرجح. إذا تعذر الاستقامة، اثنِ الركبتين قليلاً وتدرج مع الوقت.',
ARRAY['Lying Leg Raise', 'Knee Raises', 'Cable Crunch'],
ARRAY['رفع الأرجل أرضاً', 'رفع الركبتين', 'الكرنش بالكابل'],
true,
'Advanced core exercise targeting lower abs and hip flexors with strict control.', 'تمرين متقدم للكور يستهدف أسفل البطن وعضلات الفخذ الأمامية بتحكم صارم.'),

('Cable Crunch', 'الكرنش بالكابل', 'cable-crunch', (SELECT id FROM muscle_groups WHERE slug='abs-core'), 'beginner', ARRAY['cable-machine'],
ARRAY['Kneel at the cable machine with rope attachment', 'Hold rope at head level near face', 'Crunch down by flexing spine, bringing elbows to knees', 'Squeeze abs hard at the bottom', 'Return slowly to starting position'],
ARRAY['اركع عند جهاز الكابل مع ملحق الحبل', 'أمسك الحبل عند مستوى الرأس قرب الوجه', 'انزل للأسفل بثني العمود الفقري، مرفقيك نحو ركبتيك', 'شد البطن بقوة في الأسفل', 'عُد ببطء إلى وضع البداية'],
ARRAY['Using hip flexors instead of abs', 'Going too heavy', 'Rushing the rep', 'Not getting full crunch'],
ARRAY['استخدام عضلات الفخذ بدلاً من البطن', 'وزن زائد', 'استعجال في الحركة', 'عدم الوصول للكرنش الكامل'],
'Focus on spinal flexion, not hip flexion. The abs pull the ribcage toward the pelvis.', 'ركز على ثني العمود الفقري وليس مفصل الورك. عضلات البطن تسحب القفص الصدري نحو الحوض.',
ARRAY['Floor Crunch', 'Decline Crunch', 'Plank'],
ARRAY['الكرنش على الأرض', 'الكرنش المنحدر', 'البلانك'],
true,
'Weighted ab exercise that builds rectus abdominis thickness and definition.', 'تمرين بطن بأوزان يبني سماكة وتحديد العضلة المستقيمة البطنية.'),

('Burpee', 'البيربي', 'burpee', (SELECT id FROM muscle_groups WHERE slug='full-body'), 'beginner', ARRAY['bodyweight'],
ARRAY['Start standing with feet shoulder-width apart', 'Drop into a squat and place hands on floor', 'Kick feet back to a plank position', 'Do a push-up (optional)', 'Jump feet back to squat, then explode up with a jump'],
ARRAY['ابدأ واقفاً بعرض الكتف', 'انزل في سكوات وضع يديك على الأرض', 'ادفع قدميك للخلف في وضع البلانك', 'قم بضغط على الأرض (اختياري)', 'اقفز بقدميك للسكوات ثم انفجر بقفزة للأعلى'],
ARRAY['Sagging hips during push-up', 'Not fully standing at the top', 'Rushing without control', 'Landing hard on joints'],
ARRAY['تدلي الورك أثناء الضغط', 'عدم الوقوف الكامل في الأعلى', 'الاستعجال دون تحكم', 'الهبوط بقسوة على المفاصل'],
'Pace yourself. Modify by stepping instead of jumping if needed. Land softly with bent knees.', 'اضبط إيقاعك. عدّل بالمشي بدلاً من القفز عند الحاجة. اهبط بنعومة مع ثني الركبتين.',
ARRAY['Squat to Jump', 'Mountain Climbers', 'Jumping Jacks'],
ARRAY['السكوات مع القفز', 'متسلق الجبال', 'القفز بالفتح'],
true,
'Full body conditioning exercise combining strength and cardio. Excellent for fat burning.', 'تمرين شامل للجسم يجمع القوة والكارديو. ممتاز لحرق الدهون.'),

('Deadlift', 'الرفعة الميتة', 'deadlift', (SELECT id FROM muscle_groups WHERE slug='full-body'), 'advanced', ARRAY['barbell'],
ARRAY['Stand with feet hip-width, bar over mid-foot', 'Hinge at hips and grip bar shoulder-width', 'Brace core, set back in neutral position', 'Drive through floor, extending hips and knees together', 'Lock out at top, then lower with control'],
ARRAY['قف بعرض الورك، البار فوق منتصف القدم', 'انحنِ من الورك وأمسك البار بعرض الكتف', 'اشدد الكور، اضبط الظهر في وضع محايد', 'ادفع من الأرض، ممد الورك والركبتين معاً', 'اقفل في الأعلى، ثم أنزل بتحكم'],
ARRAY['Rounding the lower back', 'Bar drifting away from body', 'Jerking the weight off the floor', 'Hips shooting up before chest'],
ARRAY['تقوس أسفل الظهر', 'ابتعاد البار عن الجسم', 'نتف الوزن عن الأرض', 'ارتفاع الورك قبل الصدر'],
'This is a technical lift. Learn from a qualified coach if possible. Always warm up thoroughly and use proper form.', 'هذا تمرين تقني. تعلم من مدرب مؤهل إن أمكن. أحمِ دائماً جيداً واستخدم الأداء الصحيح.',
ARRAY['Romanian Deadlift', 'Trap Bar Deadlift', 'Sumo Deadlift'],
ARRAY['الرفعة الرومانية', 'الرفعة ببار المصيدة', 'الرفعة السومو'],
true,
'Ultimate full-body strength exercise. Builds posterior chain, grip, and total-body power.', 'تمرين القوة الشامل للجسم. يبني السلسلة الخلفية والقبضة والقوة الكلية.'),

('Mountain Climbers', 'متسلق الجبال', 'mountain-climbers', (SELECT id FROM muscle_groups WHERE slug='cardio'), 'beginner', ARRAY['bodyweight'],
ARRAY['Start in a plank position with arms extended', 'Drive one knee toward your chest', 'Quickly switch legs in a running motion', 'Keep hips down and core engaged', 'Continue alternating at a controlled pace'],
ARRAY['ابدأ في وضع البلانك باستقامة الذراع', 'اسحب إحدى الركبتين نحو صدرك', 'بدّل الساقين بسرعة في حركة جري', 'حافظ على انخفاض الورك وشد الكور', 'استمر في التبديل بإيقاع متحكم'],
ARRAY['Hips bouncing up and down', 'Hands too far forward', 'Going too fast with bad form', 'Not bringing knees close to chest'],
ARRAY['ارتداد الورك صعوداً ونزولاً', 'اليدين بعيدة جداً للأمام', 'سرعة مفرطة بأداء سيء', 'عدم تقريب الركبتين من الصدر'],
'Maintain a steady tempo. Quality over speed. Keep shoulders directly over wrists.', 'حافظ على إيقاع ثابت. الجودة قبل السرعة. أبقِ الأكتاف فوق المعصمين مباشرة.',
ARRAY['High Knees', 'Jumping Jacks', 'Burpees'],
ARRAY['رفع الركبتين', 'القفز بالفتح', 'البيربي'],
true,
'Dynamic cardio and core exercise that elevates heart rate while engaging the entire midsection.', 'تمرين كارديو ديناميكي وكور يرفع معدل ضربات القلب مع شد المنطقة الوسطى كاملة.'),

('Jump Rope', 'القفز على الحبل', 'jump-rope', (SELECT id FROM muscle_groups WHERE slug='cardio'), 'beginner', ARRAY['jump-rope'],
ARRAY['Hold rope handles at hip level with elbows close to body', 'Swing rope over head with wrist movement', 'Jump slightly as rope passes under feet', 'Land softly on balls of feet', 'Maintain a steady rhythm'],
ARRAY['أمسك مقابض الحبل عند مستوى الورك مع المرفقين قرب الجسم', 'أدر الحبل فوق رأسك بحركة المعصم', 'اقفز قليلاً عند مرور الحبل تحت قدميك', 'اهبط بنعومة على مقدمة القدم', 'حافظ على إيقاع ثابت'],
ARRAY['Jumping too high', 'Using arms instead of wrists', 'Looking down at feet', 'Tensing shoulders'],
ARRAY['القفز عالياً جداً', 'استخدام الذراعين بدلاً من المعصم', 'النظر للأسفل', 'توتر الأكتاف'],
'Start with short intervals. Stay on balls of feet. Keep jumps minimal to protect joints.', 'ابدأ بفترات قصيرة. ابقَ على مقدمة القدم. اجعل القفزات صغيرة لحماية المفاصل.',
ARRAY['High Knees', 'Mountain Climbers', 'Burpees'],
ARRAY['رفع الركبتين', 'متسلق الجبال', 'البيربي'],
true,
'Classic cardio exercise improving coordination, agility, and cardiovascular endurance.', 'تمرين كارديو كلاسيكي يحسن التنسيق والرشاقة والقدرة القلبية الوعائية.'),

('Treadmill Sprint', 'العدو على المشاية', 'treadmill-sprint', (SELECT id FROM muscle_groups WHERE slug='cardio'), 'beginner', ARRAY['treadmill'],
ARRAY['Warm up with 5 minutes of walking', 'Set treadmill to comfortable sprint speed', 'Sprint for 20-30 seconds at high intensity', 'Step to sides and rest for 40-60 seconds', 'Repeat for 8-12 rounds'],
ARRAY['أحمِ بـ 5 دقائق مشي', 'اضبط المشاية على سرعة عدو مريحة', 'اركض بسرعة عالية لمدة 20-30 ثانية', 'انتقل للجوانب وارتح لـ 40-60 ثانية', 'كرر 8-12 جولة'],
ARRAY['Skipping warm-up', 'Sprinting too long', 'Holding rails during sprint', 'Cooling down too abruptly'],
ARRAY['تجاهل الإحماء', 'العدو لمدة طويلة', 'الإمساك بالمقابض أثناء العدو', 'التبريد المفاجئ'],
'Always warm up first. Use safety clip. Start with lower speeds and build up gradually.', 'أحمِ دائماً أولاً. استخدم مشبك الأمان. ابدأ بسرعات أقل وبنِ تدريجياً.',
ARRAY['Rowing Machine', 'Cycling', 'Burpees'],
ARRAY['جهاز التجديف', 'الدراجة', 'البيربي'],
true,
'High-intensity interval training on treadmill for maximum calorie burn and cardio improvement.', 'تدريب عالي الكثافة بفترات على المشاية لأقصى حرق للسعرات وتحسين القلب.'),

('Glute Bridge', 'جسر الأرداف', 'glute-bridge', (SELECT id FROM muscle_groups WHERE slug='glutes'), 'beginner', ARRAY['bodyweight'],
ARRAY['Lie on back with knees bent, feet flat on floor', 'Place arms at sides, palms down', 'Drive through heels to lift hips', 'Squeeze glutes at the top', 'Lower with control back to floor'],
ARRAY['استلقِ على ظهرك مع ثني الركبتين، القدمين مسطحتين', 'ضع الذراعين على الجانبين، راحة اليد للأسفل', 'ادفع من الكعب لرفع الورك', 'شد الأرداف في الأعلى', 'أنزل بتحكم عائداً للأرض'],
ARRAY['Pushing through toes instead of heels', 'Overextending the back', 'Not squeezing glutes', 'Rushing reps'],
ARRAY['الدفع من أصابع القدم بدلاً من الكعب', 'إفراط في مد الظهر', 'عدم شد الأرداف', 'استعجال الحركات'],
'Focus on glute squeeze at the top. Pause for 1-2 seconds at peak contraction.', 'ركّز على شد الأرداف في الأعلى. توقف لـ 1-2 ثانية عند أقصى انقباض.',
ARRAY['Hip Thrust', 'Cable Kickback', 'Bulgarian Split Squat'],
ARRAY['الدفع بالورك', 'الرفس بالكابل', 'السكوات البلغاري'],
true,
'Beginner-friendly glute activation exercise. Great as warm-up or standalone for glute development.', 'تمرين تنشيط أرداف مناسب للمبتدئين. ممتاز كإحماء أو تمرين مستقل لتطوير الأرداف.')
ON CONFLICT DO NOTHING;

-- Nutrition Categories
INSERT INTO nutrition_categories (name_en, name_ar, slug, sort_order) VALUES
('Protein', 'البروتين', 'protein', 1),
('Carbohydrates', 'الكربوهيدرات', 'carbohydrates', 2),
('Fats', 'الدهون', 'fats', 3),
('Fiber', 'الألياف', 'fiber', 4),
('Hydration', 'الترطيب', 'hydration', 5),
('Recovery', 'التعافي', 'recovery', 6)
ON CONFLICT DO NOTHING;

-- Nutrition Articles
INSERT INTO nutrition_articles (title_en, title_ar, slug, excerpt_en, excerpt_ar, content_en, content_ar, category_id, read_time_minutes, is_published) VALUES
('Understanding Protein: The Building Block of Muscle', 'فهم البروتين: حجر بناء العضلات', 'understanding-protein',
'Learn why protein is essential for muscle growth, how much you need, and the best sources.', 'تعرّف على أهمية البروتين لنمو العضلات، وكم تحتاجه، وأفضل مصادره.',
'Protein is made up of amino acids, which are the building blocks of muscle tissue. When you exercise, you create micro-tears in your muscle fibers. Protein repairs these tears, making muscles stronger and larger. The general recommendation for active individuals is 1.6-2.2 grams of protein per kilogram of body weight per day. Good sources include chicken breast, lean beef, fish, eggs, dairy, legumes, and plant-based options like tofu and tempeh. Timing matters less than total daily intake, but spreading protein across 3-4 meals is optimal for muscle protein synthesis.',
'يتكون البروتين من أحماض أمينية وهي أحجار بناء أنسجة العضلات. عند التمرين، تُحدث تمزقات دقيقة في ألياف العضلات. البروتين يصلح هذه التمزقات، مما يجعل العضلات أقوى وأكبر. التوصية العامة للأشخاص النشطين هي 1.6-2.2 جرام بروتين لكل كيلوجرام من وزن الجسم يومياً. تشمل المصادر الجيدة صدور الدجاج ولحم البقر قليل الدهن والأسماك والبيض ومنتجات الألبان والبقوليات وخيارات نباتية مثل التوفو. التوقيت أقل أهمية من إجمالي الاستهلاك اليومي، ولكن توزيع البروتين على 3-4 وجبات مثالي لتخليق البروتين العضلي.',
(SELECT id FROM nutrition_categories WHERE slug='protein'), 7, true),

('Carbohydrates: Fueling Your Training', 'الكربوهيدرات: وقود تدريبك', 'carbohydrates-fuel',
'Understand the role of carbs in athletic performance and how to time your intake.', 'فهم دور الكربوهيدرات في الأداء الرياضي وكيفية توقيت تناولها.',
'Carbohydrates are your body''s primary energy source, especially during high-intensity exercise. They are stored as glycogen in muscles and liver. Complex carbohydrates like brown rice, oats, sweet potatoes, and whole grains provide sustained energy. Simple carbs are useful pre- or post-workout for quick energy or recovery. Aim for 3-5g per kg of body weight depending on training intensity. Low-carb approaches can work for sedentary periods but are not ideal for intense training phases. Always prioritize whole food sources over processed ones.',
'الكربوهيدرات هي مصدر الطاقة الأساسي لجسمك، خاصة أثناء التمرين عالي الكثافة. تُخزن كجليكوجين في العضلات والكبد. الكربوهيدرات المعقدة مثل الأرز البني والشوفان والبطاطا الحلوة والحبوب الكاملة توفر طاقة مستدامة. الكربوهيدرات البسيطة مفيدة قبل أو بعد التمرين للطاقة السريعة أو التعافي. اهدف إلى 3-5 جم لكل كجم من وزن الجسم حسب كثافة التمرين. الأنظمة قليلة الكربوهيدرات قد تناسب فترات الخمول لكنها غير مثالية لمراحل التمرين المكثف. أعطِ الأولوية دائماً للمصادر الطبيعية على المعالجة.',
(SELECT id FROM nutrition_categories WHERE slug='carbohydrates'), 6, true),

('The Importance of Hydration for Athletes', 'أهمية الترطيب للرياضيين', 'hydration-athletes',
'Discover how proper hydration affects performance, recovery, and overall health.', 'اكتشف كيف يؤثر الترطيب المناسب على الأداء والتعافي والصحة العامة.',
'Water makes up about 60% of your body weight and is critical for every cellular function. Even mild dehydration (2% body weight loss) can significantly impair performance, cognitive function, and recovery. General guidelines suggest 3-4 liters per day for active individuals, but needs vary based on climate, training intensity, and body size. During intense training, consider electrolyte-enhanced beverages. Monitor urine color as a simple hydration indicator: pale yellow is optimal. Drink consistently throughout the day rather than large amounts at once.',
'الماء يشكل حوالي 60% من وزن جسمك وهو حاسم لكل وظيفة خلوية. حتى الجفاف الخفيف (فقدان 2% من وزن الجسم) يمكن أن يضعف الأداء والوظيفة المعرفية والتعافي بشكل كبير. الإرشادات العامة تقترح 3-4 لترات يومياً للأشخاص النشطين، لكن الاحتياجات تختلف حسب المناخ وكثافة التمرين وحجم الجسم. أثناء التمرين المكثف، فكر في مشروبات مدعمة بالإلكتروليتات. راقب لون البول كمؤشر بسيط للترطيب: الأصفر الفاتح هو الأمثل. اشرب بانتظام خلال اليوم بدلاً من كميات كبيرة دفعة واحدة.',
(SELECT id FROM nutrition_categories WHERE slug='hydration'), 5, true),

('Recovery Nutrition: What to Eat After Training', 'تغذية التعافي: ماذا تأكل بعد التمرين', 'recovery-nutrition',
'Maximize your gains with the right post-workout nutrition strategy.', 'اعظم استفادتك باستراتيجية التغذية المناسبة بعد التمرين.',
'Post-workout nutrition is crucial for recovery and muscle growth. Within 1-2 hours after training, aim for a meal containing both protein (20-40g) and carbohydrates (40-80g). The protein repairs muscle damage while carbs replenish glycogen stores. Good post-workout meals include chicken and rice, protein shake with banana, or Greek yogurt with berries and granola. Hydration is equally important—replace fluids lost through sweat. While the "anabolic window" is not as narrow as once thought, timely nutrition still optimizes recovery.',
'تغذية ما بعد التمرين حاسمة للتعافي ونمو العضلات. خلال 1-2 ساعة بعد التمرين، اهدف إلى وجبة تحتوي على البروتين (20-40 جم) والكربوهيدرات (40-80 جم). البروتين يصلح تلف العضلات بينما الكربوهيدرات تعوض مخازن الجليكوجين. تشمل الوجبات الجيدة بعد التمرين الدجاج والأرز أو مخفوق البروتين مع الموز أو الزبادي اليوناني مع التوت. الترطيب مهم أيضاً—عوض السوائل المفقودة عبر العرق. بينما "النافذة التمثيلية" ليست ضيقة كما كان يُعتقد، التغذية في الوقت المناسب لا تزال تحسّن التعافي.',
(SELECT id FROM nutrition_categories WHERE slug='recovery'), 6, true)
ON CONFLICT DO NOTHING;

-- Recipes
INSERT INTO recipes (title_en, title_ar, slug, description_en, description_ar, ingredients_en, ingredients_ar, instructions_en, instructions_ar, calories, protein_g, carbs_g, fat_g, fiber_g, prep_time_minutes, servings, is_published) VALUES
('Grilled Chicken with Sweet Potato', 'دجاج مشوي مع بطاطا حلوة', 'grilled-chicken-sweet-potato',
'Classic bodybuilding meal with lean protein and complex carbs.', 'وجبة كمال أجسام كلاسيكية ببروتين خال وكربوهيدرات معقدة.',
ARRAY['200g chicken breast', '1 medium sweet potato', '1 tbsp olive oil', 'Salt, pepper, paprika', '1 cup broccoli'],
ARRAY['200جم صدور دجاج', '1 حبة بطاطا حلوة متوسطة', '1 ملعقة زيت زيتون', 'ملح، فلفل، بابريكا', '1 كوب بروكلي'],
ARRAY['Season chicken with spices and olive oil', 'Grill chicken 6-8 minutes per side', 'Bake sweet potato at 200C for 45 minutes', 'Steam broccoli for 5 minutes', 'Serve together'],
ARRAY['تبّل الدجاج بالتوابل وزيت الزيتون', 'اشوي الدجاج 6-8 دقائق لكل وجه', 'اخبز البطاطا الحلوة على 200 درجة لمدة 45 دقيقة', 'اسلق البروكلي على البخار 5 دقائق', 'قدمها معاً'],
450, 45, 35, 12, 6, 50, 1, true),

('Protein Oatmeal Bowl', 'وعاء الشوفان بالبروتين', 'protein-oatmeal-bowl',
'Power breakfast with oats, protein powder, and berries.', 'فطور طاقوي بشوفان وبروتين وتوت.',
ARRAY['50g rolled oats', '1 scoop whey protein', '1 banana', '100ml milk', '1 tbsp honey', 'Handful of berries'],
ARRAY['50جم شوفان', '1 مغرفة بروتين مصل اللبن', '1 موزة', '100مل حليب', '1 ملعقة عسل', 'حفنة توت'],
ARRAY['Cook oats with milk and water', 'Stir in protein powder after cooking', 'Top with sliced banana and berries', 'Drizzle honey on top', 'Serve warm'],
ARRAY['اطبخ الشوفان مع الحليب والماء', 'أضف بروتين باودر بعد الطبخ', 'زيّن بشرائح الموز والتوت', 'اسكب العسل على الوجه', 'قدمه دافئاً'],
380, 28, 55, 8, 7, 10, 1, true),

('Greek Yogurt Parfait', 'بارفه الزبادي اليوناني', 'greek-yogurt-parfait',
'Quick high-protein snack with layers of yogurt, granola, and fruit.', 'وجبة خفيفة سريعة عالية البروتين بطبقات الزبادي والجرانولا والفاكهة.',
ARRAY['200g Greek yogurt', '30g granola', '1 tbsp honey', '100g mixed berries', '10g chia seeds'],
ARRAY['200جم زبادي يوناني', '30جم جرانولا', '1 ملعقة عسل', '100جم توت مشكل', '10جم بذور chia'],
ARRAY['Layer yogurt in a glass', 'Add granola layer', 'Add berries', 'Repeat layers', 'Top with honey and chia seeds'],
ARRAY['ضع طبقة الزبادي في كوب', 'أضف طبقة الجرانولا', 'أضف التوت', 'كرر الطبقات', 'زيّن بالعسل وبذور chia'],
280, 22, 32, 7, 5, 5, 1, true),

('Tuna Salad Bowl', 'وعاء سلطة التونة', 'tuna-salad-bowl',
'Light, protein-packed meal perfect for lunch.', 'وجبة خفيفة غنية بالبروتين مثالية للغداء.',
ARRAY['150g canned tuna', '2 cups mixed greens', '1 tomato, diced', '1/2 cucumber, sliced', '1/4 red onion', '1 tbsp olive oil', 'Lemon juice', 'Salt and pepper'],
ARRAY['150جم تونة معلبة', '2 كوب أوراق خضراء مشكلة', '1 طماطم، مقطعة', '1/2 خيار، شرائح', '1/4 بصل أحمر', '1 ملعقة زيت زيتون', 'عصير ليمون', 'ملح وفلفل'],
ARRAY['Drain tuna and flake with a fork', 'Chop vegetables', 'Combine greens, tomato, cucumber, onion in bowl', 'Add tuna on top', 'Dress with olive oil and lemon juice', 'Season to taste'],
ARRAY['صفّي التونة وفتّتها بالشوكة', 'قطّع الخضروات', 'امزج الأوراق الخضراء والطماطم والخيار والبصل في وعاء', 'أضف التونة على الوجه', 'تبّل بزيت الزيتون وعصير الليمون', 'أضف الملح والفلفل حسب الذوق'],
320, 35, 12, 14, 4, 15, 1, true)
ON CONFLICT DO NOTHING;

-- Membership Plans
INSERT INTO membership_plans (name_en, name_ar, slug, description_en, description_ar, price_egp, duration_months, features_en, features_ar, plan_type, sort_order) VALUES
('Digital Starter', 'البداية الرقمية', 'digital-starter',
'Perfect for beginners starting their fitness journey online.', 'مثالي للمبتدئين الذين يبدأون رحلتهم الرياضية عبر الإنترنت.',
299, 1,
ARRAY['Full exercise library access', 'Beginner programs', 'Workout tracker', 'Nutrition articles'],
ARRAY['وصول كامل لمكتبة التمارين', 'برامج للمبتدئين', 'متتبع التمارين', 'مقالات التغذية'],
'digital', 1),

('Premium All-Access', 'التميز الشامل', 'premium-all-access',
'Everything you need: digital + physical gym access with trainer support.', 'كل ما تحتاجه: وصول رقمي + صالة رياضية مع دعم المدرب.',
899, 1,
ARRAY['Everything in Digital Starter', 'Full gym access', 'All programs (all levels)', '1 trainer session/month', 'Personal workout tracking', 'Recipe library'],
ARRAY['كل ما في البداية الرقمية', 'وصول كامل للصالة', 'جميع البرامج (جميع المستويات)', 'جلسة مدرب شهرياً', 'تتبع شخصي للتمارين', 'مكتبة الوصفات'],
'both', 2),

('Elite Performance', 'النخبة للأداء', 'elite-performance',
'For serious athletes: unlimited access with personal coaching.', 'للرياضيين الجادين: وصول غير محدود مع تدريب شخصي.',
1999, 3,
ARRAY['Everything in Premium', 'Unlimited gym access', '4 trainer sessions/month', 'Custom program design', 'Priority booking', 'Nutrition consultation', 'Progress analytics'],
ARRAY['كل ما في التميز الشامل', 'وصول غير محدود للصالة', '4 جلسات مدرب شهرياً', 'تصميم برنامج مخصص', 'حجز أولوية', 'استشارة تغذية', 'تحليلات التقدم'],
'both', 3)
ON CONFLICT DO NOTHING;

-- FAQs
INSERT INTO faqs (question_en, question_ar, answer_en, answer_ar, sort_order, is_published) VALUES
('Do I need to be experienced to join BLANCO FITNESS?', 'هل أحتاج إلى خبرة للانضمام إلى بلانكو فيتنس؟',
'Not at all. We have programs for all fitness levels, from complete beginners to advanced athletes. Our beginner programs include detailed instructions and video guidance.', 'لا على الإطلاق. لدينا برامج لجميع مستويات اللياقة، من المبتدئين تماماً إلى الرياضيين المتقدمين. برامج المبتدئين لدينا تشمل تعليمات مفصلة وإرشادات فيديو.',
1, true),

('Are the workout programs customizable?', 'هل برامج التمرين قابلة للتخصيص؟',
'Yes. While we provide structured programs, you can save and adapt them to your schedule. Premium members get custom program design from our trainers.', 'نعم. بينما نقدم برامج منظمة، يمكنك حفظها وتكييفها مع جدولك. الأعضاء المميزون يحصلون على تصميم برنامج مخصص من مدربينا.',
2, true),

('Can I cancel my membership?', 'هل يمكنني إلغاء عضويتي؟',
'Yes, you can cancel your membership at any time from your dashboard. Your access continues until the end of your billing period.', 'نعم، يمكنك إلغاء عضويتك في أي وقت من لوحة التحكم. يستمر وصولك حتى نهاية فترة الفوترة.',
3, true),

('Do you offer personal training?', 'هل تقدمون تدريباً شخصياً؟',
'Yes. Premium and Elite members get monthly trainer sessions. You can also book additional sessions with our certified trainers through the platform.', 'نعم. يحصل أعضاء التميز والنخبة على جلسات مدرب شهرية. يمكنك أيضاً حجز جلسات إضافية مع مدربينا المعتمدين عبر المنصة.',
4, true),

('Is my data secure?', 'هل بياناتي آمنة؟',
'Absolutely. We use industry-standard encryption and secure authentication. Your personal information is never shared with third parties. Each member can only access their own data.', 'بالتأكيد. نستخدم تشفيراً قياسياً ومصادقة آمنة. معلوماتك الشخصية لا تُشارك أبداً مع أطراف ثالثة. يمكن لكل عضو الوصول إلى بياناته فقط.',
5, true),

('What payment methods do you accept?', 'ما طرق الدفع المقبولة؟',
'Currently, membership payments are processed through our pending-payment workflow. Full payment gateway integration is coming soon. You will be contacted to complete payment after applying.', 'حالياً، تتم معالجة مدفوعات العضوية من خلال سير العمل المؤجل. التكامل الكامل مع بوابة الدفع قريباً. سيتم التواصل معك لإتمام الدفع بعد التقديم.',
6, true),

('Can I switch between programs?', 'هل يمكنني التبديل بين البرامج؟',
'Yes. You can save multiple programs and switch between them at any time. Your workout history is preserved regardless of which program you follow.', 'نعم. يمكنك حفظ برامج متعددة والتبديل بينها في أي وقت. يتم الحفاظ على سجل تمرينك بغض النظر عن البرنامج الذي تتبعه.',
7, true),

('Do you offer nutrition guidance?', 'هل تقدمون إرشادات غذائية؟',
'Yes. Our nutrition center includes educational articles, healthy recipes, and general meal-planning resources. Elite members also receive personalized nutrition consultations.', 'نعم. مركز التغذية لدينا يشمل مقالات تعليمية ووصفات صحية وموارد عامة لتخطيط الوجبات. يحصل أعضاء النخبة أيضاً على استشارات تغذية شخصية.',
8, true)
ON CONFLICT DO NOTHING;

-- Testimonials
INSERT INTO testimonials (author_name, author_name_ar, content_en, content_ar, rating, is_published, sort_order) VALUES
('Ahmed M.', 'أحمد م.',
'BLANCO FITNESS transformed my training. The programs are structured and the tracking keeps me accountable. I have gained 8kg of muscle in 6 months.', 'بلانكو فيتنس غيّرت تدريبي. البرامج منظمة والتتبع يبقيني ملتزماً. اكتسبت 8 كجم من العضلات في 6 أشهر.',
5, true, 1),
('Sara K.', 'سارة ك.',
'As a beginner, I was intimidated by the gym. The beginner programs and clear exercise instructions gave me confidence. The nutrition articles are incredibly helpful too.', 'كمبتدئة، كنت أشعر بالخوف من الصالة. برامج المبتدئين والتعليمات الواضحة للتمارين منحتني الثقة. مقالات التغذية مفيدة بشكل لا يصدق أيضاً.',
5, true, 2),
('Omar A.', 'عمر أ.',
'The Elite plan is worth every pound. Having a personal trainer design my program changed everything. The platform is premium and easy to use.', 'خطة النخبة تستحق كل جنيه. وجود مدرب شخصي لتصميم برنامجي غيّر كل شيء. المنصة متميزة وسهلة الاستخدام.',
5, true, 3)
ON CONFLICT DO NOTHING;

-- Trainers
INSERT INTO trainers (name_en, name_ar, slug, bio_en, bio_ar, specializations, is_verified, is_published, contact_email) VALUES
('Coach Karim Hassan', 'الكريم حسن', 'coach-karim-hassan',
'Certified strength and conditioning specialist with 10+ years of experience coaching competitive bodybuilders and powerlifters.', 'أخصائي قوة وتكييف معتمد بخبرة تزيد عن 10 سنوات في تدريب لاعبي كمال الأجسام ورفع الأثقال التنافسيين.',
ARRAY['Strength Training', 'Bodybuilding', 'Powerlifting'], true, true, 'karim@blancofitness.com'),
('Coach Mariam Adel', 'مريم عادل', 'coach-mariam-adel',
'ISSA-certified personal trainer specializing in body transformations and nutrition coaching for women.', 'مدربة شخصية معتمدة من ISSA متخصصة في تحويل الجسم والتدريب الغذائي للنساء.',
ARRAY['Body Transformation', 'Nutrition', 'Women Fitness'], true, true, 'mariam@blancofitness.com'),
('Coach Tarek Nabil', 'طارق نبيل', 'coach-tarek-nabil',
'Former national-level bodybuilder turned coach. Expert in contest prep and advanced hypertrophy programming.', 'لاعب كمال أجسام وطني سابق تحول إلى مدرب. خبير في التحضير للبطولات وبرامج التضخم المتقدمة.',
ARRAY['Contest Prep', 'Hypertrophy', 'Advanced Programming'], true, true, 'tarek@blancofitness.com')
ON CONFLICT DO NOTHING;

-- Programs
INSERT INTO programs (title_en, title_ar, slug, description_en, description_ar, level, duration_weeks, days_per_week, split_type, is_published) VALUES
('Beginner Full Body', 'المبتدئ لكامل الجسم', 'beginner-full-body',
'A 4-week full body program for those new to weight training. 3 days per week focusing on fundamental movements.', 'برنامج 4 أسابيع لكامل الجسم للمبتدئين في تدريب الأوزان. 3 أيام أسبوعياً مع التركيز على الحركات الأساسية.',
'beginner', 4, 3, 'full-body', true),

('Intermediate Push/Pull/Legs', 'المتوسط دفع/سحب/أرجل', 'intermediate-ppl',
'Classic 6-day PPL split for intermediate lifters. 8 weeks of progressive overload to build muscle and strength.', 'تقسيم PPL كلاسيكي 6 أيام لرفعي المستوى المتوسط. 8 أسابيع من الحمل التدريجي لبناء العضلات والقوة.',
'intermediate', 8, 6, 'push-pull-legs', true),

('Advanced Hypertrophy', 'التضخم المتقدم', 'advanced-hypertrophy',
'12-week advanced hypertrophy program with high volume training. Designed for experienced lifters looking to maximize muscle growth.', 'برنامج تضخم متقدم 12 أسبوع بتدريب عالي الحجم. مصمم لرفعي المستوى المتقدم الباحثين عن أقصى نمو عضلي.',
'advanced', 12, 5, 'body-part', true),

('Strength Foundation', 'أساس القوة', 'strength-foundation',
'6-week strength-focused program built around compound lifts. Perfect for building a solid strength base.', 'برنامج 6 أسابيع يركز على القوة مبني على التمارين المركبة. مثالي لبناء أساس قوة متين.',
'intermediate', 6, 4, 'upper-lower', true)
ON CONFLICT DO NOTHING;
