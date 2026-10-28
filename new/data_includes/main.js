PennController.ResetPrefix(null) // Removes PennController prefixes, keep this here
DebugOff(); // Uncomment this line when you are ready to collect actual data to disable debug mode.

Header(
    // void
)
.log("prolific_pid", GetURLParameter("PROLIFIC_PID"))

// Define the sequence of the experiment blocks with randomization
Sequence("welcome", "check_preloaded", "instructions", "practice", "start", randomize("experiment"), "send_results", "redirect", "thank_you");
// "participant_data",

// Welcome page ///////////////////////////////////////////
newTrial("welcome",
    defaultText
        .center()
        .print()
        ,
    newText("welcome", "<p>Üdv!</p>")
        .css("font-size", "150%")
        .center()
        .print()
        ,
    newText(  
        "<p>A kísérletben magyar mondatokat fogsz olvasni, amik alapján döntéseket kell hoznod. A részletes instrukciókat később mutatjuk.</p>" +
        "<p>A kísérlet körülbelül <b>15 percet</b> vesz igénybe; a következő oldalakon áttekintjük az instrukciókat, és egy gyakorló kört is csinálunk.</p>" +
        "<p>Figyelj oda és válassz a lehető leggyorsabban; hagyatkozz az első megérzéseidre!</p>"
        )
        .center()
        .print()
        ,
      
    newText("<p>Ha beleegyezel, hogy részt vegyél ebben a kísérletben, hozzájárulsz a következő adatok gyűjtéséhez: demográfiai adatok, olvasási idők és a teszt során hozott döntések. Ezeket az információkat anonim módon tároljuk, és csak tudományos célokra használjuk fel.</p>")

        .cssContainer("width", "75%")
        .cssContainer("border", "solid 4px #88c0d0")
        .cssContainer("padding-left", "10px")
        ,

    newHtml("consent_form", `<p><input type="checkbox" class="obligatory"> Elolvastam és megértettem a fentieket, hozzájárulok az adatok gyűjtéséhez, és szeretnék részt venni a kísérletben.</p>`)
        .checkboxWarning("A folytatáshoz beleegyezés szükséges.")
        .center()
        .print()
        .log()
        ,

    newButton("continue_button", "Tovább")
        .center()
        .print()
        .wait(getHtml("consent_form")
        .test.complete()
        .failure(getHtml("consent_form").warn())
        ),
    fullscreen()
);

// Check preloaded //////////////////////////////////////////////////----------
newTrial("check_preloaded",
    CheckPreloaded(),
    newText("<p>Kísérleti adatok betöltése...</p>")
        .center()
        .print(),
    
    // 0% (1100 ms)
    newText("prog_0", "<p>[..........] 00 %</p>")
        .css("font-family", "monospace").center().print(),
    newTimer("t_1100", 1100).start().wait(),
    getText("prog_0").remove(),

    // 10% (1000 ms)
    newText("prog_10", "<p>[>.........] 10 %</p>")
        .css("font-family", "monospace").center().print(),
    newTimer("t_1000", 1000).start().wait(),
    getText("prog_10").remove(),

    // 20% (900 ms)
    newText("prog_20", "<p>[>>........] 20 %</p>")
        .css("font-family", "monospace").center().print(),
    newTimer("t_900", 900).start().wait(),
    getText("prog_20").remove(),

    // 30% (800 ms)
    newText("prog_30", "<p>[>>>.......] 30 %</p>")
        .css("font-family", "monospace").center().print(),
    newTimer("t_800", 800).start().wait(),
    getText("prog_30").remove(),

    // 40% (700 ms)
    newText("prog_40", "<p>[>>>>......] 40 %</p>")
        .css("font-family", "monospace").center().print(),
    newTimer("t_700", 700).start().wait(),
    getText("prog_40").remove(),

    // 50% (600 ms)
    newText("prog_50", "<p>[>>>>>.....] 50 %</p>")
        .css("font-family", "monospace").center().print(),
    newTimer("t_600", 600).start().wait(),
    getText("prog_50").remove(),

    // 60% (500 ms)
    newText("prog_60", "<p>[>>>>>>....] 60 %</p>")
        .css("font-family", "monospace").center().print(),
    newTimer("t_500", 500).start().wait(),
    getText("prog_60").remove(),

    // 70% (400 ms)
    newText("prog_70", "<p>[>>>>>>>...] 70 %</p>")
        .css("font-family", "monospace").center().print(),
    newTimer("t_400", 400).start().wait(),
    getText("prog_70").remove(),

    // 80% (300 ms)
    newText("prog_80", "<p>[>>>>>>>>..] 80 %</p>")
        .css("font-family", "monospace").center().print(),
    newTimer("t_300", 300).start().wait(),
    getText("prog_80").remove(),

    // 90% (200 ms)
    newText("prog_90", "<p>[>>>>>>>>>.] 90 %</p>")
        .css("font-family", "monospace").center().print(),
    newTimer("t_200", 200).start().wait(),
    getText("prog_90").remove(),

    // 100% (100 ms)
    newText("prog_100", "<p>[>>>>>>>>>>] 100%</p>")
        .css("font-family", "monospace").center().print(),
    newTimer("t_100", 100).start().wait(),
    getText("prog_100").remove()
);

// Participant data ///////////////////////////////////////////////////////////
newTrial("participant_data",
    defaultText
        .print()
        .center(),
    
    newText("newline", "<p>...</p>").hidden(),
    
    newText("title", "<p>Résztvevői információk</p>")
        .css("font-size", "150%")
        .center()
        .print()
        ,
    newText("<p>Írd be a <b>Prolific ID-dat</b>:</p>")
        .center()
        .print()
    ,
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
    newText("<p>Figyelem: A kifizetés előtt ellenőrizzük a rögzített adatok érvényességét.</p>")
        .css("font-size", "100%")
        .css("text-align", "center")
        .center()
        .print()
    ,
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
    newText("instruction_title", "<p>Instrukciók</p>")
        .css("font-size", "150%")
        .center()
        .print()
        ,
    newText(
    "<p><b>A kísérlet a következőképpen fog zajlani:</b></p>" + 
    "<p>• <b>Olvasás:</b> A mondatokat szóról szóra fogod látni. A <b>szóközzel</b> léphetsz a következő szóra.</p>" + 
    "<p>• <b>Kontextus és kérdések:</b> Bizonyos mondatok előtt egy extra kontextust is láthatsz majd, utánuk pedig egy rövid kérdést is kaphatsz.</p>" + 
    "<p>• <b>Választás:</b> Minden mondat után választanod kell két lehetőség közül, nyomd meg az <b>F</b> gombot a bal oldali, vagy a <b>J</b> gombot a jobb oldali opcióért!</p>" +
    "<p>• <b>Feladat:</b> VÁLASZD AZT AZ OPCIÓT AMELYIK LEGJOBBAN MEGFELEL AZ ÉPPEN LÁTOTT MONDATNAK, VAGY MEGVÁLASZOLJA A KÉRDÉST!</p>"
    ),
    newText("newline", "<p> </p>").hidden(),
    newText("Most három gyakorlófeladat következik!")
        .css("font-size", "120%")
        .print(),
    newText("gap", "<p> <br> <br> <br> </p>").hidden(),
    newTimer("9000", 9000).start().wait(),
    newText("<p> Nyomd meg a szóközt a folytatáshoz!</p>"),
    newText("space", "(______)").center().print(),

    // Flash the underline 5 times (on/off, blink cycle)
    getTimer("flash_wait", 0), 
    getText("space").hidden(), newTimer("b1", 250).start().wait(),
    getText("space").visible(), newTimer("b2", 250).start().wait(),
    getText("space").hidden(), newTimer("b3", 250).start().wait(),
    getText("space").visible(), newTimer("b4", 250).start().wait(),
    getText("space").hidden(), newTimer("b5", 250).start().wait(),
    getText("space").visible(), newTimer("b6", 250).start().wait(),
    getText("space").hidden(), newTimer("b7", 250).start().wait(),
    getText("space").visible(), newTimer("b8", 250).start().wait(),
    newKey("space_to_continue", " ").wait(),
    fullscreen(),
);

// Practice //////////////////////////////////////////////////-----------------
Template("practice.csv", row => 
    newTrial("practice",
        defaultText
            .center()
            .print(),
    
        // Delay before the trial starts
        newTimer("500", 500).start().wait(),
        
        // Practice banner
        newText("practice_text", "Gyakorlás " + row.item + "/3")
            .css("font-size", "175%")
            .center()
            .print(),

        // Show preview
        defaultImage.size("45vh", "45vh"),

        newCanvas("left_canvas_preview", "45vw", "50vh")
            .add("center at 50%", "middle at 50%", newImage("left_image_preview", (row.cb === "y" ? row.b : row.a) + ".jpg"))
            .print("center at 25vw", "middle at 50vh"),
        newCanvas("right_canvas_preview", "45vw", "50vh")
            .add("center at 50%", "middle at 50%", newImage("right_image_preview", (row.cb === "y" ? row.a : row.b) + ".jpg"))
            .print("center at 75vw", "middle at 50vh"),

        // Delay before space reminder
        getTimer("500").start().wait(),
        newText("space_reminder","<p>Nyomd meg a szóközt a folytatáshoz!</p>").center().print("center at 50vw", "middle at 75vh"),
        newKey("space_after_preview", " ").wait(),
        getText("space_reminder").remove(),
        getCanvas("left_canvas_preview").remove(),
        getCanvas("right_canvas_preview").remove(),
        
        // Show context sentence if available
        newText("context", row.context)
        .testNot.text("")
        .success(
            getText("context")
                .css("font-size", "150%")
                .css("max-width", "75vw")
                .print("center at 50vw", "middle at 50vh"),
            // Delay before space reminder
            getTimer("500").start().wait(),
            newText("space_reminder_after_context", "<p>Nyomd meg a szóközt a folytatáshoz!</p>").center().print("center at 50vw", "middle at 75vh"),
            newKey("context_key", " ").log().wait(),
            getText("space_reminder_after_context").remove(),
            getText("context").remove(),
        ),

        // Fixation cross before sentence (500ms cross)
        newText("fixation_cross_before_sentence", "+").center().css("font-size", "250%").print("center at 50vw", "middle at 50vh"),
        newTimer("fixation_cross_before_sentence_", 500).start().wait(),
        getText("fixation_cross_before_sentence").remove(),
        
        // Show regions
        getTimer("500").start().wait(),
        newText("space_reminder_before_sentence","<p>Nyomd meg a szóközt a folytatáshoz!</p>").center().print("center at 50vw", "middle at 75vh"),
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
        
        newText("r6", row.r6).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
        newKey("r6", " ").log().wait(),
        getText("r6").remove(),
        
        // Show question if there is one
        newText("question", row.question)
        .testNot.text("")
        .success(
            getText("question")
                .css("font-size", "150%")
                .css("max-width", "75vw")
                .print("center at 50vw", "middle at 50vh"),
            // Delay before space reminder
            getTimer("500").start().wait(),
            newText("space_reminder_after_question", "<p>Nyomd meg a szóközt a folytatáshoz!</p>").center().print("center at 50vw", "middle at 75vh"),
            newKey("question_key", " ").log().wait(),
            getText("space_reminder_after_question").remove(),
            getText("question").remove()
        ),

        // Fixation cross before selection (500ms cross)
        newText("fixation_cross_before_selection_practice", "+").center().css("font-size", "250%").print("center at 50vw", "middle at 50vh"),
        newTimer("fixation_cross_before_selection_practice_", 500).start().wait(),
        getText("fixation_cross_before_selection_practice").remove(),
        
        // Show choice
        defaultImage.size("45vh", "45vh"),
        
        newCanvas("left_canvas", "45vw", "50vh")
            .add("center at 50%", "middle at 50%", newImage("left_image", (row.cb === "y" ? row.b : row.a) + ".jpg"))
            .print("center at 25vw", "middle at 50vh"),
        newCanvas("right_canvas", "45vw", "50vh")
            .add("center at 50%", "middle at 50%", newImage("right_image", (row.cb === "y" ? row.a : row.b) + ".jpg"))
            .print("center at 75vw", "middle at 50vh"),
        
        // Delay after choice appears
        getTimer("500").start().wait(),
        newText("click_reminder","<p>Nyomd meg az <b>F</b> billentyűt a bal oldali, vagy a <b>J</b> billentyűt a jobb oldali opcióért!</p>").center().print("center at 50vw", "middle at 75vh"),
        newKey("choice_key", "fj")
            .log()
            .wait()
    )
    .log("participant_id", getVar("participant_id"))
    .log("no", row.no)
    .log("item", row.item)
    .log("exp", row.exp)
    .log("cnd", row.cnd)
    .log("counterbalancing", row.cb)
    .log("a", row.a)
    .log("b", row.b)
    .log("correct", row.correct)
    .log("participant_id", PennController.GetURLParameter("participant_id") )
);

// Start message //////////////////////////////////////////////////////////////
newTrial("start",
    defaultText
        .center()
        .print()
        ,
    newText("<p>Ennyi az egész, jöhet az igazi kísérlet.</p>")
        .css("font-size", "150%")
        .center()
        .print("center at 50vw", "middle at 25vh")
        ,
    newText("<p>Kezdődik a kísérlet!</p>")
        .css("font-size", "300%")
        .center()
        .print("center at 50vw", "middle at 50vh")
        ,
    newButton("Tovább")
        .center()
        .print("center at 50vw", "middle at 75vh")
        .wait()
);

// Experiment /////////////////////////////////////////////////////////////////
Template("list_02.csv", row => 
    newTrial("experiment",
        defaultText
            .center()
            .print(),
    
        // Delay before the trial starts
        newTimer("500", 500).start().wait(),

        // Show preview 
        defaultImage.size("45vh", "45vh"),

        newCanvas("left_canvas_preview", "45vw", "50vh")
            .add("center at 50%", "middle at 50%", newImage("left_image_preview", (row.cb === "y" ? row.b : row.a) + ".jpg"))
            .print("center at 25vw", "middle at 50vh"),
        newCanvas("right_canvas_preview", "45vw", "50vh")
            .add("center at 50%", "middle at 50%", newImage("right_image_preview", (row.cb === "y" ? row.a : row.b) + ".jpg"))
            .print("center at 75vw", "middle at 50vh"),

        // Delay before allowed to continue
        getTimer("500").start().wait(),
        newKey("space_after_preview", " ").wait(),
        getCanvas("left_canvas_preview").remove(),
        getCanvas("right_canvas_preview").remove(),
        
        // Show context sentence if available (before sentence regions)
        newText("context", row.context)
        .testNot.text("")
        .success(
            getText("context")
                .css("font-size", "150%")
                .css("max-width", "75vw")
                .print("center at 50vw", "middle at 50vh"),
            // Delay before allowed to continue
            getTimer("500").start().wait(),
            newKey("context_key", " ").log().wait(),
            getText("context").remove(),
        ),

        // Fixation cross before sentence (500ms cross)
        newText("fixation_cross_before_sentence", "+").center().css("font-size", "250%").print("center at 50vw", "middle at 50vh"),
        newTimer("fixation_cross_before_sentence_", 500).start().wait(),
        getText("fixation_cross_before_sentence").remove(),
        
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

        newText("r6", row.r6).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
        newKey("r6", " ").log().wait(),
        getText("r6").remove(),
        
        // Show question if there is one
        newText("question", row.question)
        .testNot.text("")
        .success(
            getText("question")
                .css("font-size", "150%")
                .css("max-width", "75vw")
                .print("center at 50vw", "middle at 50vh"),
            // Delay before allowed to continue
            getTimer("500").start().wait(),
            newKey("question_key", " ").log().wait(),
            getText("question").remove(),
        ),

        // Fixation cross before selection (500ms cross)
        newText("fixation_cross_before_selection", "+").center().css("font-size", "250%").print("center at 50vw", "middle at 50vh"),
        newTimer("fixation_cross_before_selection_", 500).start().wait(),
        getText("fixation_cross_before_selection").remove(),

        defaultImage.size("45vh", "45vh"),

        newCanvas("left_canvas", "45vw", "50vh")
            .add("center at 50%", "middle at 50%", newImage("left_image", (row.cb === "y" ? row.b : row.a) + ".jpg"))
            .print("center at 25vw", "middle at 50vh"),
        newCanvas("right_canvas", "45vw", "50vh")
            .add("center at 50%", "middle at 50%", newImage("right_image", (row.cb === "y" ? row.a : row.b) + ".jpg"))
            .print("center at 75vw", "middle at 50vh"),

        // Delay before allowing choice
        // getTimer("500").start().wait(),
        newKey("choice_key", "fj")
            .log()
            .wait()
    )
    .log("participant_id", getVar("participant_id"))
    .log("exp", row.exp)
    .log("no", row.no)
    .log("item", row.item)
    .log("type", row.type)
    .log("cnd", row.cnd)
    .log("counterbalancing", row.cb)
    .log("a", row.a)
    .log("b", row.b)
    .log("correct", row.correct)
    .log("vpx", row.vpx)
    .log("def", row.def)
    .log("pst", row.pst)
    .log("mlt", row.mlt)
    .log("alt", row.alt)
    .log("participant_id", PennController.GetURLParameter("participant_id") )
);

// Send results to the server
newTrial("send_results",
    defaultText
        .center()
        .print(),

    SendResults(),
    
    newText("sending_results_text", "Kérjük, várjon, amíg elmentjük a válaszait...").center().print(),
    newTimer("wait_after_send", 1000).start().wait(),
    getText("sending_results_text").text("A válaszait elmentettük.").center().print(),
    getTimer("wait_after_send").start().wait(),
    newText("newline", "<p>...</p>").hidden(),
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
    newText("redirect_link", '<p><a href="https://app.prolific.com/submissions/complete?cc=CR4L1YTW" target="_blank" rel="noopener noreferrer">https://app.prolific.com/submissions/complete?cc=CR4L1YTW</a></p>') // list_02
    .css("font-size", "150%").print(),
    newTimer("wait_before_done", 1000).start().wait(),
    newText("newline", "<p>...</p>").hidden(),
    newButton("done_button","Kész!").center().print().wait().log(),
)

// Thank you screen and end of the experiment
newTrial( "thank_you",
    defaultText
    .center()
    .print(),
    
    newText("thank_you_text", "<p>Ez a kísérlet vége, köszönjük a részvételt!</p>")
                                .print(),
    newText("close_text", "<p>Most már bezárhatod ezt az ablakot.</p>")
    .print(),

    newButton("finish_button").wait(),
);