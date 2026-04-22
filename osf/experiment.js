PennController.ResetPrefix(null) // Removes PennController prefixes, keep this here
DebugOff(); // Uncomment this line when you are ready to collect actual data to disable debug mode.

Header(
   // void
)
.log("prolific_id", GetURLParameter("id") )

// IMPORTANT NOTE: when running this project, the eye-tracker will highlight
// the element that it estimates the participant is looking at
// Edit the file PennController.css in the Aesthetics folder to remove highlighting

// Resources if hosted as ZIP files on a distant server (why tho?)
// PreloadZip("https://github.com/partigabor/pcibex-hun/blob/main/images.zip")

EyeTrackerURL("https://mondo1.dreamhosters.com/script.php")

// Sequence("consent","participant_id","setcounter","introduction","introduction2","practice1","practice2","pract2attention","practice3","pract3attention",
//         "start_experiment",rshuffle("exp1-fema", "exp1-femb","exp1-masa","exp1-masb","exp1-attentiona","exp1-attentionb"),"break", 
//         rshuffle("exp2-fema", "exp2-femb","exp2-masa","exp2-masb","exp2-attentiona","exp2-attentionb"),
//         "audioconfirm","posttest1","posttest1_gender1","posttest2","posttest2_gender2","posttest3","posttest3_gender3","posttest4","posttest4_gender4","Final-Q",SendResults(), "survey", "end");

// // Define the sequence of the experiment blocks
Sequence("welcome", "participant_data", "calibration", "check_preloaded", "instructions", "practice", "start", "experiment", "send_results", "redirect", "thank_you");
// randomize("experiment"),

// Welcome page ///////////////////////////////////////////
newTrial("welcome",
    defaultText
        // .css("width", "80%") // Make text block readable
        // .css("margin", "auto") // Center the text block
        // .css("font-size", "100%") // Font size
        .center()
        .print()
        ,
    // newText("welcome", "<p>Welcome!</p>")
    newText("welcome", "<p>Üdv!</p>")
        .css("font-size", "150%")
        .center()
        .print()
        ,
    newText(  
        // "<p>This experiment is part of a project supervised by Dr. Yu-Yin Hsu of The Hong Kong Polytechnic University.</p>" +
        // "<p>In this online experiment, you will read sentences in Hungarian and make some simple decisions. You will see detailed instructions later.</p>" +
        // "<p>You can take part in the experment ONLY if you are using use a <b>computer</b> with a <b>physical keyboard</b>, and a <b>webcam</b>. <br>You should start the experiment ONLY if you have the time to <b>complete it</b> and with <b>no rush</b>; it is <b>not possible</b> to save the current session. <br><u>If you <b>close the browser window</b>, you will have to <b>start over</b></u>. Firefox and Chrome are recommended. </p>" +
        // "<p>The study will take approximately <b>30 minutes</b> to complete; on the next screens we will walk you though calbiration, instructions, and conduct a practice round. </p>" +
        // "<p>Please pay attention and respond as quickly and accurately as possible!</p>" +
        // "<p>If you have any questions, you can contact us at: gabor.parti@connect.polyu.hk</p>"
        "<p>Ebben a kísérletben magyar nyelvű mondatokat fogsz olvasni, amikről majd döntéseket kell hoznod. A részletes instrukciókat később mutatjuk. <br>Ez a kísérlet a Hongkongi Műszaki Egyetemen zajlik (The Hong Kong Polytechnic University), Dr. Yu-Yin Hsu felügyelete alatt.</p>" +
        "<p>Csak akkor vegyél részt a kísérletben, ha <b>számítógépet/laptopot</b> használsz, <b>billentyűzettel, egérrel és webkamerával</b>. <br>Kérjük, csak akkor kezdd el a kísérletet, ha <b>befejezni</b> is van időd és <b>nem sietsz</b>, a munkamenet <b>nem menthető</b>; <br><u> Ha bezárod a böngészőablakot, újra kell kezdened!</u> <b>Chrome</b> használata ajánlott, Firefox nem működik!</p>" +
        "<p>A kísérlet körülbelül <b>15-20 percet</b> vesz igénybe; a következő oldalakon végigvesszük a webkamera/szemkövetés kalibrálását, az instrukciókat, és egy gyakorló kört is csinálunk.</p>" +
        "<p>Kérjük, hogy egy <b>fényes/jól megvilágított helyen</b> kezdj ennek neki, figyelj oda és válassz a lehető leggyorsabban és legpontosabban!</p>" +
        "<p>Ha bármilyen kérdésed van, a következő e-mail címen elérsz minket: gabor.parti@connect.polyu.hk</p>"
        )
        .center()
        .print()
        ,
    
        // newText("<p>If you agree to take part in this study, you consent that the following data will be collected: demographic data, reading times, eye movement within this window and the choices you made during the trials. These information will be stored anonymously and will only be used for scientific purposes.</p>")
        newText("<p>Ha beleegyezel, hogy részt vegyél ebben a kísérletben, hozzájárulsz a következő adatok gyűjtéséhez: demográfiai adatok, olvasási idők, szemmozgás ezen az ablakon belül, és a teszt során hozott döntések. Ezeket az információkat anonim módon tároljuk, és csak tudományos célokra használjuk fel.</p>")
        .cssContainer("width", "80%")
        .cssContainer("border", "solid 2px blue")
        .cssContainer("padding-left", "10px")
        ,

    // newHtml("consent_form", `<p><input type="checkbox" class="obligatory"> I have read the above, I consent to the collection of my data, and I wish to participate in the experiment.</p>`)
    newHtml("consent_form", `<p><input type="checkbox" class="obligatory"> Elolvastam és megértettem a fentieket, hozzájárulok az adatok gyűjtéséhez, és szeretnék részt venni a kísérletben.</p>`)
        // .cssContainer({"margin":"1em"})
        // .cssContainer({"width":"720px"})
        // .checkboxWarning("You must indicate your consent if you wish to continue.")
        .checkboxWarning("A folytatáshoz beleegyezés szükséges.")
        .center()
        .print()
        .log()
        ,

    // newButton("continue_button", "Continue")
    newButton("continue_button", "Tovább")
        .center()
        .print()
        // .wait(getScale("consent").test.selected())
        .wait(getHtml("consent_form")
        .test.complete()
        .failure(getHtml("consent_form").warn()
        // .css('margin-bottom','20px'),
        )
        ),
    
    fullscreen()
);


// Calibration page ///////////////////////////////////////////////////////
// We do a first calibration here---meanwhile, the resources are preloading

newTrial("calibration",
    defaultText
        .center()
        .print()
        ,
    // newText("calibration_title", "<p>Calibration</p>")
    newText("calibration_title", "<p>Kalibrálás</p>")
        .css("font-size", "150%")
        .center()
        .print()
        ,
    // newText(`<p>This experiment needs to access your webcam to follow your eye movements.</p>
    //         <p>We only collect data on where on this page your eyes are looking during the experiment.</p>`)
    newText(
        `<p>Ez a kísérlet hozzáférést kér a webkamerádhoz, hogy nyomon követhesse a szemmozgásodat.</p>
        <p>Ahhoz, hogy ez működjön, kérjük, <b>egy fényes, jól megvilágított helyen</b> végezd el a kísérletet.</p>
        <p>Fontos, hogy az <b>arcod</b> jól látható legyen (különösen ha szemüveges vagy), és a fény ne a hátad mögül érje a kamerát.</p>
        <p>Kövesd majd a megjelenő <b>zöld gombot</b> a szemeddel!</p>
        `)
        .center()
        .print()
        ,
    defaultImage.size("40vh", "20vh"),
    newCanvas("posture", "20vw", "20vh")
        .add("center at 50%", "middle at 50%", newImage("posture.png"))
        .print("center at 50vw", "middle at 75vh"),
        
    // newButton("I understood, start the calibration", "Understood, continue")
    newButton("Értettem, tovább a kalibráláshoz", "Értettem, tovább")
        .center()
        .print()
        .wait(newEyeTracker("tracker").test.ready())
        .remove()
        ,
    clear(),
    fullscreen(),
    
    // Start calibrating the eye-tracker, allow for up to 2 attempts
    // 50 means that calibration succeeds when 50% of the estimates match the click coordinates
    // Increase the threshold for better accuracy, but more risks of losing participants
    getEyeTracker("tracker").calibrate(60,2)
    ,
    // newText(`<p>You will see the same button in the middle of the screen before each trial.</p>
            // <p>Fixate on it for 3 seconds to check that the tracker is still well calibrated.</p>
            // <p>If it is, the trial will start after 3 seconds. Otherwise, you will go through calibration again.</p>`)
    newText(`<p>Minden mondat előtt ugyanez a <b>zöld gomb</b> jelenik majd meg a   képernyő közepén.</p>
            <p><b>Fikszáld rá a tekinteted 3 másodpercig</b>, ez ellenőrzi, hogy jól működik-e még a követő.</p>
            <p>Ha félrenézel vagy valami gond van, újrakalibrálás következik. Ha minden rendben, indul a feladat.</p>`)
        .center()
        .print()
    ,
    // newButton("Continue")
    newButton("Tovább")
        .center()
        .print()
        .wait()
);



// Check preloaded ////////////////////////////////////////////////////////////
newTrial("check_preloaded",
    // Wait if the resources have not finished preloading by the time the tracker is calibrated
    CheckPreloaded(),
    // newText("<p>Loading experiment data...</p>")
    newText("<p>Kísérleti adatok betöltése...</p>")
        .center()
        .print()
        ,
        
    newTimer("1000", 1000).start().wait(),
    ),



// Participant data ///////////////////////////////////////////////////////////
newTrial("participant_data",
    defaultText
        .print()
        .center(),
    
    newText("newline", "<p>...</p>").hidden(),
        
    // newText("title", "<p>Participant information</p>")
    newText("title", "<p>Résztvevői információk</p>")
        .css("font-size", "150%")
        .center()
        .print()
        ,
    // newText("<p>Enter your <b>Prolific ID</b>:</p>")
    newText("<p>Írd be a <b>Prolific ID-dat</b>:</p>")
        .center()
        .print()
    ,
    
    // newText("<p>Fill in the field and press ENTER (↵).</p>")
    newText("<p>Töltsd ki a mezőt, majd nyomd meg az ENTER (↵) gombot a folytatáshoz.</p>")
        .center()
        .print()
    ,
    
    newTextInput("input_participant_id")
        .log()
        .center()
        .print()
        .lines(1)
        .css('margin-bottom','20px')
        .wait( getTextInput("input_participant_id").testNot.text("") )
    ,

    getText("newline").hidden(),
    
    // newText("<p>Notice: Before payment, we will check the validity of the recorded data.</p>")
    newText("<p>Figyelem: A kifizetés előtt ellenőrizzük a rögzített adatok érvényességét.</p>")
        .css("font-size", "110%")
        .css("text-align", "center")
        .center()
        .print()
    ,
    // newButton("Continue")
    newButton("Tovább")
        .print()
        .center()
        .wait(getTextInput("input_participant_id").testNot.text(""))
    ,
    newVar("participant_id")
        .global()
        .set( getTextInput("input_participant_id")),
)
    .log("participant_id" , getVar("participant_id")),

    fullscreen(),

// Instructions ///////////////////////////////////////////////////////////////
newTrial("instructions",
    defaultText
        .center()
        .print()
        ,
    
    // newText("instruction_title", "<p>Instructions</p>")
    newText("instruction_title", "<p>Instrukciók</p>")
        .css("font-size", "150%")
        .center()
        .print()
        ,
        
    // newText("<p>In this experiment, you will read Hungarian sentences.</p>" + 
    // "<p>Before each sentence, you will see an image pair that gives you some context.</p>" + 
    // "<p>Before each sentence, you will see a fixation cross (+) in the center of the screen. </p>" + 
    // "<p>You will not see the full sentences, but <b>one word at a time</b>.</p>" + 
    // "<p>Use the <b>space bar</b> (␣) to move to the next word, which will be shown in the center of your screen.</p>" + 
    // "<p>Make sure you understand the word on the screen before pressing the space bar and moving to the next one.</p>" + 
    // "<p>After each sentence, you will see <b>two images</b> on the left and right side of the screen.</p>" + 
    // "<p>Your task is to <b>choose</b> the image that best fits the sentence you read.</p>" + 
    // "<p>You must <b>click</b> on an image to make a selection and move on to the next item.</p>"
    // ),
    newText(
    "<p>Ebben a kísérletben mondatokat fogsz olvasni.</p>" + 
    "<p>A mondatok <b>előtt</b> egy képpárt vagy szópárt fogsz látni, amely némi kontextust ad.</p>" + 
    "<p>Minden mondat előtt egy fikszáló keresztet (+) is fogsz látni a képernyő közepén.</p>" + 
    "<p>Nem fogod látni a teljes mondatot egyben, hanem egyszerre csak egy-egy szót.</p>" + 
    "<p><u>Használd a <b>szóköz/space billentyűt</b> a következő szóhoz való továbblépéshez!</u></p>" + 
    "<p>Győződj meg róla, hogy megértetted a képernyőn lévő szót, mielőtt továbbmész.</p>" +
    "<p>Néhány mondat <b>után</b> egy kérdést is felteszünk, itt is a szóközzel tudsz továbbhaladni ha megértetted a kérdést.</p>" +  
    "<p>Minden mondat után <b>két képet/két szót</b> fogsz látni a képernyő bal és jobb oldalán.</p>" + 
    "<p>A feladatod az, hogy <b>kiválaszd</b> azt a képet, amelyik a jobban illik az éppen látott mondatra, vagy megválaszolja a kérdést.</p>" + 
    "<p>Döntésedet az <b>egérrel</b> kell jelezned, csak <b>kattints</b> arra a képre/szóra amelyiket választottad.</p>"
    ),
    
    newText("newline", "<p>...</p>").hidden(),

    // newText("Try to respond as quickly and accurately as you can!")
    newText("Próbálj meg gyorsan és pontosan válaszolni!")
        .css("font-size", "120%")
        .print(),
    
    getText("newline").hidden(),
        
    newText("space", "______"),
    // newText("<p> (Press the space bar to continue) </p>"),
    newText("<p> (Nyomd meg a szóközt a folytatáshoz) </p>"),
    newKey("space", " ").wait(),
    
    fullscreen(),
);



// Practice ///////////////////////////////////////////////////////////////////
Template("practice.csv", row => 
    newTrial("practice",
        defaultText
        .center()
        .print(),

    
    // Delay before the trial starts
    newTimer("1000", 1000).start().wait(),
    
    // Check/recalibrate the tracker before every trial 
    newEyeTracker("tracker").calibrate(60,2),  // ET //
    
    // Text
    newText("practice_text", "Gyakorlás " + row.item + "/3")
        .css("font-size", "150%")
        .center()
        .print(),

    // Show images (images are placed on canvases, which serve as clickable regions)
    defaultImage.size("45vh", "45vh"),

    newCanvas("left_canvas_preview", "45vw", "70vh")
        .add("center at 50%", "middle at 50%", newImage("left_image_preview", row.left + ".png"))
        .print("center at 25vw", "middle at 50vh"),
    newCanvas("right_canvas_preview", "45vw", "70vh")
        .add("center at 50%", "middle at 50%", newImage("right_image_preview", row.right + ".png"))
        .print("center at 75vw", "middle at 50vh"),

    // Delay after images preview
    getTimer("1000").start().wait(),

    // newText("spacebar","<p> (Press the space bar to continue) </p>").center().print("center at 50vw", "middle at 50vh"),
    newText("space_reminder","<p> (Nyomd meg a szóközt a folytatáshoz) </p>").center().print("center at 50vw", "middle at 75vh"),
    newKey("continue", " ").wait(),
    getText("space_reminder").remove(),
    getCanvas("left_canvas_preview").remove(),
    getCanvas("right_canvas_preview").remove(),
    
    // Fixation
    newText("fixation_cross_before_sentence", "+").center().css("font-size", "250%").print("center at 50vw", "middle at 50vh"),
    getTimer("1000").start().wait(),
    getText("fixation_cross_before_sentence").remove(),
    getTimer("1000").start().wait(),
    
    // Show regions
    newText("space_reminder_before_sentence","<p> (Nyomd meg a szóközt a folytatáshoz) </p>").center().print("center at 50vw", "middle at 75vh"),
    newKey("r0", " ").log().wait(),
    getText("space_reminder_before_sentence").remove(),
    
    newText("r1", row.r1).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey("r1", " ").log().wait(),
    getText("r1").remove(),
    
    newText("r2", row.r2).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey("r2", " ").log().wait(),
    getText("r2").remove(),
    
    newText("r3", row.r3).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey("r3", " ").log().wait(),
    getText("r3").remove(),
    
    newText("r4", row.r4).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey("r4", " ").log().wait(),
    getText("r4").remove(),
    
    newText("r5", row.r5).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey("r5", " ").log().wait(),
    getText("r5").remove(),
    
    newText("r6", row.r6)
    .testNot.text("")
    .success(
        getText("r6").css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
        newKey("r6", " ").log().wait(),
        getText("r6").remove()
    ),
    
    newText("r7", row.r7)
    .testNot.text("")
    .success(
        getText("r7").css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
        newKey("r7", " ").log().wait(),
        getText("r7").remove()
    ),
    
    // Wait before showing the question
    getTimer("1000").start().wait(),
    
    newText("question", row.question)
    .testNot.text("")
    .success(
        getText("question").css("font-size", "150%").css("max-width", "20vw").css("overflow-wrap", "break-word").css("text-align", "center").print("center at 50vw", "middle at 50vh"),
        getTimer("1000").start().wait(),
        getText("space_reminder").print("center at 50vw", "middle at 75vh"),
        newKey("question", " ").log().wait(),
        getText("question").remove(),
        getText("space_reminder").remove(),
        getTimer("1000").start().wait(),
    ),

    // Fixation
    newText("fixation_cross_before_selection_practice", "+").center().css("font-size", "250%").print("center at 50vw", "middle at 50vh"),
    getTimer("1000").start().wait(),
    getText("fixation_cross_before_selection_practice").remove(),
    getTimer("1000").start().wait(),
    
    // Show image pair
    defaultImage.size("45vh", "45vh"),
    
    newCanvas("left_canvas", "45vw", "70vh")
        .add("center at 50%", "middle at 50%", newImage("left_image", row.left + ".png"))
        .print("center at 25vw", "middle at 50vh"),
    newCanvas("right_canvas", "45vw", "70vh")
        .add("center at 50%", "middle at 50%", newImage("right_image", row.right + ".png"))
        .print("center at 75vw", "middle at 50vh").log(),
    
        // Activate tracker // ET //
        getEyeTracker("tracker")
            .add(   // We track the Canvas elements   
                getCanvas("left_canvas"),
                getCanvas("right_canvas"))
                .log()  // If this line is missing, the eye-tracking data won't be sent to the server
                .start(),
        
        // Delay after choice appears
        getTimer("1000").start().wait(),
        
        // newText("spacebar","<p> (Press the space bar to continue) </p>").center().print("center at 50vw", "middle at 50vh"),
        newText("click_reminder","<p> (Kattints az egyikre a folytatáshoz) </p>").center().print("center at 50vw", "middle at 75vh"),
        
        // Collect participant's choice by clicking on one of the images
        newSelector("choice_selector")
            .add(
                getCanvas("left_canvas"), 
                getCanvas("right_canvas")) // Define clickable elements
            // .shuffle() // Always shuffles and also adds a delay, hardcode it instead!
            .once() // Participant can only click once
            .log() // Log which element was selected (its ID) and the reaction time //"all"?
            .wait(), // Wait for a selection (click)
            
        // Stop tracker to prevent collecting unnecessary data
        getEyeTracker("tracker").stop(), // ET //
    
    )
    // Log additional trial information from the CSV file to the results
    .log("participant_id", getVar("participant_id"))
    .log("group", row.group)
    .log("no", row.no)
    .log("item", row.item)
    .log("exp", row.exp)
    .log("condition", row.condition)
    .log("counterbalancing", row.cb)
    .log("left", row.left)
    .log("right", row.right)
    .log("target", row.target)
    
    // Log these global variables for each trial result line as well (if needed, e.g., for counterbalancing from URL)
    .log( "participant_id" , PennController.GetURLParameter("participant_id") )
);



// Start message //////////////////////////////////////////////////////////////
newTrial("start",
    defaultText
        .center()
        .print()
        ,
    // newText("<p>That's it, now we move on to the real experiment.</p>")
    newText("<p>Ennyi az egész, jöhet az igazi kísérlet.</p>")
        .center()
        .print("center at 50vw", "middle at 25vh")
        ,
        // newText("<p>Live trials will start now! </p>")
    newText("<p>Kezdődik a kísérlet!</p>")
        .css("font-size", "300%") // Font size
        .center()
        .print("center at 50vw", "middle at 50vh")
        ,
    //newButton("Continue")
    newButton("Tovább")
        .center()
        .print("center at 50vw", "middle at 75vh")
        .wait()
);



// // Real Experiment
// Template("experiment_data.csv", row => // Trial structure using data from the CSV file
//     newTrial( "experiment_trial",
// Grouping
// newTrial( "exp1-"+row.cond+row.group,



// Experiment /////////////////////////////////////////////////////////////////
Template("experiment_data.csv", row => 
    newTrial("experiment",
        defaultText
        .center()
        .print(),
    
    // Check/recalibrate the tracker before every trial
    newEyeTracker("tracker").calibrate(60,2),  // ET //

    // Delay before the trial starts
    newTimer("1000", 1000).start().wait(),

    // Show image pair
    defaultImage.size("45vh", "45vh"),

    newCanvas("left_canvas_preview", "45vw", "70vh")
        .add("center at 50%", "middle at 50%", newImage("left_image_preview", row.left + ".png" || row.left + ".jpg"))
        .print("center at 25vw", "middle at 50vh"),
    newCanvas("right_canvas_preview", "45vw", "70vh")
        .add("center at 50%", "middle at 50%", newImage("right_image_preview", row.right + ".png" || row.right + ".jpg"))
        .print("center at 75vw", "middle at 50vh"),

    // Delay after images preview
    getTimer("1000").start().wait(),

    // newText("spacebar","<p> (Press the space bar to continue) </p>").center().print("center at 50vw", "middle at 50vh"),
    newText("space_reminder","<p> (Szóköz a folytatáshoz) </p>").center().print("center at 50vw", "middle at 75vh"),
    newKey(" ").wait(),
    getText("space_reminder").remove(),
    getCanvas("left_canvas_preview").remove(),
    getCanvas("right_canvas_preview").remove(),
    
    // Fixation
    newText("fixation_cross_before_sentence", "+").center().css("font-size", "250%").print("center at 50vw", "middle at 50vh"),
    getTimer("1000").start().wait(),
    getText("fixation_cross_before_sentence").remove(),
    getTimer("1000").start().wait(),
    
    // Show regions
    newKey("r0", " ").log().wait(),
    
    newText("r1", row.r1).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey("r1", " ").log().wait(),
    getText("r1").remove(),
    
    newText("r2", row.r2).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey("r2", " ").log().wait(),
    getText("r2").remove(),
    
    newText("r3", row.r3).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey("r3", " ").log().wait(),
    getText("r3").remove(),
    
    newText("r4", row.r4).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey("r4", " ").log().wait(),
    getText("r4").remove(),
    
    newText("r5", row.r5).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey("r5", " ").log().wait(),
    getText("r5").remove(),

    newText("r6", row.r6)
    .testNot.text("")
    .success(
        getText("r6").css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
        newKey("r6", " ").log().wait(),
        getText("r6").remove()
    ),
    
    newText("r7", row.r7)
    .testNot.text("")
    .success(
        getText("r7").css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
        newKey("r7", " ").log().wait(),
        getText("r7").remove()
    ),
    
   // Wait before showing the question
    getTimer("1000").start().wait(),

    newText("question", row.question)
    .testNot.text("")
    .success(
        getText("question").css("font-size", "150%").css("max-width", "20vw").css("overflow-wrap", "break-word").css("text-align", "center").print("center at 50vw", "middle at 50vh"),
        newKey("question", " ").log().wait(),
        getText("question").remove()
    ),
    
    // Fixation
    newText("fixation_cross_before_selection", "+").center().css("font-size", "250%").print("center at 50vw", "middle at 50vh"),
    getTimer("1000").start().wait(),
    getText("fixation_cross_before_selection").remove(),
    getTimer("1000").start().wait(),

    // Show image pair
    defaultImage.size("45vh", "45vh"),

    newCanvas("left_canvas", "45vw", "70vh")
        .add("center at 50%", "middle at 50%", newImage("left_image", row.left + ".png"))
        .print("center at 25vw", "middle at 50vh"),
    newCanvas("right_canvas", "45vw", "70vh")
        .add("center at 50%", "middle at 50%", newImage("right_image", row.right + ".png"))
        .print("center at 75vw", "middle at 50vh").log(),

        // // Activate tracker // ET //
        getEyeTracker("tracker")
            .add(   // We track the Canvas elements   
                getCanvas("left_canvas"),
                getCanvas("right_canvas"),
                )
                .log()  // If this line is missing, the eye-tracking data won't be sent to the server
                .start(),

        // Collect participant's choice by clicking on one of the images
        newSelector("choice_selector")
            .add(
                getCanvas("left_canvas"), 
                getCanvas("right_canvas")) // Define clickable elements
            // .shuffle() // Always shuffles and also adds a delay, hardcode it instead!
            .once() // Participant can only click once
            .log() // Log which element was selected (its ID) and the reaction time //"all"?
            .wait(), // Wait for a selection (click)
        
        // // Delay after choice appears
        // getTimer("1000").start().wait(),

        // // newText("spacebar","<p> (Press the space bar to continue) </p>").center().print("center at 50vw", "middle at 50vh"),
        // newText("click_reminder","<p> (Kattints az egyikre a folytatáshoz) </p>").center().print("center at 50vw", "middle at 75vh"),
        
        // Stop tracker to prevent collecting unnecessary data
        getEyeTracker("tracker").stop(), // ET //
    
    )
    // Log additional trial information from the CSV file to the results
    .log("participant_id", getVar("participant_id"))
    .log("group", row.group)
    .log("no", row.no)
    .log("item", row.item)
    .log("exp", row.exp)
    .log("condition", row.condition)
    .log("counterbalancing", row.cb)
    .log("left", row.left)
    .log("right", row.right)
    .log("target", row.target)
    
    // Log these global variables for each trial result line as well (if needed, e.g., for counterbalancing from URL)
    .log( "participant_id" , PennController.GetURLParameter("participant_id") )
);



// Send results to the server
newTrial("send_results",
    defaultText
        .center()
        .print(),

    // The SendResults command will try to send data to the server.
    // This is handled by PCIbex farm's infrastructure or your own backend if self-hosting.
    SendResults(), // This command handles sending all collected data.
    
    // newText("sending_results_text", "Please wait while we save your responses...").center().print(),
    newText("sending_results_text", "Kérjük, várjon, amíg mentjük a válaszait...").center().print(),
    newTimer("wait_after_send", 1000).start().wait(), // Brief pause to ensure data sending process initiates
    // getText("sending_results_text").text("Your responses have been saved.").center().print(), // Update text
    getText("sending_results_text").text("A válaszait elmentettük.").center().print(), // Update text
    getTimer("wait_after_send", 1000).start().wait(), // Brief pause to ensure data sending process completes
    newText("newline", "<p>...</p>").hidden(),
    // newButton("Done.").center().print().wait(),
    newButton("Tovább.").center().print().wait(),

    exitFullscreen(),
)


// Thank you screen and end of the experiment
newTrial( "redirect",
    defaultText
    .center()
    .print(),
    
    newText("redirect_text", "<p>Kattints az alábbi linkre, hogy a kísérlet befejezését a Prolific oldalon is jelezd!")
    .print(),
    newText("redirect_link", '<p><a href="https://app.prolific.com/submissions/complete?cc=C1KD1A87" target="_blank" rel="noopener noreferrer">https://app.prolific.com/submissions/complete?cc=C1KD1A87</a></p>')
    .css("font-size", "150%").print(),
    newTimer("wait_before_done", 1500).start().wait(),
    newText("newline", "<p>...</p>").hidden(),
    newButton("done_button","Kész!").center().print().wait().log(),
)

// Thank you screen and end of the experiment
newTrial( "thank_you",
    defaultText
    .center()
    .print(),
    
    // newText("thank_you_text", "<p>This is the end of the experiment, thank you for your participation!</p>").print(),
    newText("thank_you_text", "<p>Ez a kísérlet vége, köszönjük a részvételt!</p>")
                                .print(),
    newText("email_text", "<p>Ha bármilyen kérdésed van, a következő e-mail címen elérsz minket: gabor.parti@connect.polyu.hk</p>")
                                .print(),
    // newText("close_text", "<p>You can now close this window.</p>").print(),
    newText("close_text", "<p>Most már bezárhatod ezt az ablakot.</p>")
    .print(),

    // This button is not printed but keeps the page open until the participant closes it.
    newButton("finish_button").wait(),
)

// .setOption("countsForProgressBar", false); // This trial does not count towards the progress bar.
