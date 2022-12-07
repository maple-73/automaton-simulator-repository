let automata = 
{
    mode: "dfa",
    numState: 4, /*状態数*/
    numSign: 4, /*記号の種類数*/
    tapeLength: 5, /*テープの長さ*/
    sigma: [], /*入力された記号の集合*/
    delta: [], /*遷移関数の集合*/
    firstState: undefined,
    currentStateInt: undefined,
    indicating: 0, /*矢印のノード*/
    currentTape: 0, /*読まれているテープの位置*/

    countOfExecuted: 0,

    getSigma: function()
    {
        let gotten = [];
        for(let i = 0 ; i < this.numSign ; i++)
        {
            gotten[i] = document.getElementsByClassName("input-sign")[i].textContent;
        }
        this.sigma = gotten;
    },

    getDelta: function(){
        let gotten = [];
        let count = 0;
        for(let i = 0 ; i < this.numState ; i++){
            gotten[i] = [];

            for(let j = 0 ; j < this.numSign ; j++){
                gotten[i][j] = document.getElementsByClassName("transition-function")[count].value;
                count++;
            }
        }
        this.delta = gotten;
    },

    getFirstState: function(){
        this.firstState = document.getElementsByClassName("input-first-state")[0].textContent.split("q").join('');
        this.currentStateInt = this.firstState;
    }
}

/*------------------メインの関数-------------------*/

/*オートマトンの切り替え*/
function toggleAutomata(){
    
    /*決定性の場合、非決定性に変更する。*/
    if(automata.mode == "dfa"){
        automata.mode = "nfa";
        automata.numSign++;
        let dfa = document.getElementsByClassName("dfa")[0];
        dfa.textContent = "非決定性有限オートマトン";
        dfa.className = "nfa";

        /*ε記号を追加する*/
        let parent = document.getElementsByClassName("state")[0].parentNode;
        let epsilon = document.createElement("tr");
        epsilon.className = "tr0";
        epsilon.classList.add("input-sign");
        epsilon.textContent = "ε";
        parent.insertBefore(epsilon, document.getElementsByClassName("tr1")[0]);

        for(let i = 0 ; i < automata.numState ; i++){
            let td = document.createElement("td");
            let input = document.createElement("input");
            input.className = "transition-function";
            input.size = "5";
            input.maxlength = "40";
            td.appendChild(input);
            epsilon.appendChild(td);
        }

        /*実行ボタンの実行関数を置換*/
        document.getElementsByClassName("execute")[0].setAttribute("onClick", "exeNFA()");

        /*テキストボックスをtextareaに置換*/
        for(let i = 0 ; i < automata.numSign * automata.numState ; i++){
            let oldChild = document.getElementsByClassName("transition-function")[i];
            let newChild = document.createElement("textarea");
            newChild.cols = "4";
            newChild.rows = "1";
            newChild.className = "transition-function";
            oldChild.parentNode.replaceChild(newChild, oldChild);

            newChild.addEventListener("keydown", (e) => {
                text = e.target.value;

                /*textareaの自動サイズ調整*/
                if(e.code == "Enter"){
                    newChild.rows++;
                }else if(e.code == "Backspace"){
                    let numIndent = 1;
                    for(let i = 0 ; i < text.length - 1 ; i++){
                        if(text[i] == '\n'){
                            numIndent++;
                        }
                    }
                    e.target.rows = numIndent;
                }
            }, false);
        }

        batchOff();
        setBatchInput();


    /*非決定性の場合、決定性に変更する。*/
    }else if(automata.mode == "nfa"){
        automata.mode = "dfa";
        automata.numSign--;
        let nfa = document.getElementsByClassName("nfa")[0];
        nfa.textContent = "決定性有限オートマトン";
        nfa.className = "dfa";
        let epsilon = document.getElementsByClassName("tr0")[0];
        let parent = document.getElementsByClassName("state")[0].parentNode;
        parent.removeChild(epsilon);

        for(let i = 0 ; i < automata.numSign * automata.numState ; i++){
            let oldChild = document.getElementsByClassName("transition-function")[i];
            let newChild = document.createElement("input");
            newChild.type = "text";
            newChild.className = "transition-function";
            newChild.size = "5";
            newChild.maxlength = "40";
            oldChild.parentNode.replaceChild(newChild, oldChild);
        }

        /*実行ボタンの実行関数を置換*/
        document.getElementsByClassName("execute")[0].setAttribute("onClick", "exeDFA()");

        batchOff();
        setBatchInput();
    }
}

/*入力不足に対するエラー出力*/
function inputErrorChecker(){
    document.getElementsByClassName("result")[0].textContent = "";
    let errorOfFirstState = 0;
    let errorOfAcceptState = 0;
    if(document.getElementsByClassName("input-first-state")[0].textContent == "選択する"){
        errorOfFirstState = 1;
        document.getElementsByClassName("result")[0].textContent += "初期状態を選択してください。";
    }
    if(document.getElementsByClassName("accept")[0] == undefined){
        errorOfAcceptState = 1;
        document.getElementsByClassName("result")[0].textContent += "受理状態を選択してください。";
    }
    if(errorOfFirstState == 1 || errorOfAcceptState == 1){
        console.log(error);//errorは定義されていないためエラーで実行終了
    }
}

/*決定性オートマトン*/
function exeDFA(){

    inputErrorChecker();

    if(automata.countOfExecuted > 0){
        resetPointer();
    }

    automata.getFirstState(); //succeed /*初期状態を取得*/
    automata.getSigma(); //succeed /**状態を取得/
    automata.getDelta(); //succeed /*遷移関数を取得*/
    
    
    /*最初の一回はすぐに実行*/
    indicate();
    console.log(automata.currentStateInt);
    transit();

    /*1秒毎に読んでいるテープの位置と、状態を出力*/
    const executeStepByStep = setInterval(() => {
        if(automata.indicating < automata.tapeLength){
            indicate();/*矢印さす*/
            transit();
        }else{/*テープの右端についたら終了*/
            clearInterval(executeStepByStep);
            indicate();
            outputResult();
        }
    }, 1000);

    automata.countOfExecuted++;
}

/*非決定性オートマトン*/
function exeNFA(){

    inputErrorChecker();

    let converted = {
        transitionFunction: [],
        numState: automata.numState,
        numSign: automata.numSign,
        firstState: automata.firstState,

        converter: function(){
            
            let length = document.getElementsByClassName("epsilon")[this.firstState].length;
            for(let i = 0 ; i < length ; i++){
                
            }
        },
    }

    /*繊維関数を取得*/converted.transitionFunction = automata.getDelta();
    console.table(converted.transitionFunction);

    /*splitで3次元配列にする*/
    for(let i = 0 ; i < converted.numState * converted.numSign ; i++){
        converted.transitionFunction[i] = document.getElementsByClassName("transition-function")[i].value.split("\n");
    }
    console.table(converted.transitionFunction);
    /*--------------*/
    /*初期状態からεで移動できるノードをまとめる。*/
    /**/
    /*--------------*/
}

function transit(){/*状態を遷移*/
    let readSign = document.getElementsByClassName("input-tape-el")[automata.currentTape].value;

    for(let i = 0 ; i < automata.numSign ; i++){
        console.log("sigma" + i + " = " + automata.sigma[i]);
        if(readSign == automata.sigma[i]){
            for(let j = 0 ; j < automata.numState ; j++){
                if(automata.currentStateInt == j){
                    automata.currentStateInt = automata.delta[i][j].split("q").join('');/*状態遷移*/
                    console.log("automata.currentStateInt = " + automata.currentStateInt);
                    automata.currentTape++;
                    break;
                }
            }
            break;
        }
    }
}

function indicate(){

    /*矢印がある場合は取り除く*/
    if(automata.indicating > 0){
        if(document.getElementsByClassName("tape-indicator-el")[automata.indicating - 1].textContent == "↓"){
            document.getElementsByClassName("tape-indicator-el")[automata.indicating - 1].textContent = "";
        }
    }

    /*引数iに当てはまる場所に矢印をセット*/
    document.getElementsByClassName("tape-indicator-el")[automata.indicating].textContent = "↓";

    if(automata.indicating < automata.tapeLength){
        /*矢印のあるノードを記録*/
        automata.indicating++;
    }
    
}

function outputResult(){
    let result = document.getElementsByClassName("result")[0];
    if(document.getElementsByClassName("state-el")[automata.currentStateInt].classList.contains("accept") == true){
        result.textContent = "受理";
    }else{
        result.textContent = "非受理";
    }
}

function resetPointer(){
    console.log(automata.indicating);
    automata.currentStateInt = undefined;
    document.getElementsByClassName("tape-indicator-el")[automata.indicating].textContent = "";
    automata.indicating = 0;
    automata.currentTape = 0;
}

function setAccept(){//クリックした状態をacceptに設定し、色を変える。
    for(let i = 0 ; i < automata.numState ; i++){
        let state = document.getElementsByClassName("state-el")[i];
        state.addEventListener("click", () => {
            if(state.classList.contains("accept")){
                state.classList.remove("accept");
            }else{
                state.classList.add("accept");
            }
        }, false);
    }
}

/*まとめて入力のeventListener追加*/
function setBatchInput(){

    const batchOnButton = document.getElementsByClassName("batch-input-on")[0];
    const batchOffButton = document.getElementsByClassName("batch-input-off")[0];

    /*行数、列数を増減した後にイベントリスナーを追加しなければならない*/
    /*batch-input実行中に行列増減すると、入力中止するようにする*/

    /*onボタン押下時に実行*/
    batchOnButton.addEventListener("click", batchOn, false);
    /*offボタン押下時に実行*/
    batchOffButton.addEventListener("click", batchOff, false);
}

function batchOn(){
    const batchOnButton = document.getElementsByClassName("batch-input-on")[0];
    const batchOffButton = document.getElementsByClassName("batch-input-off")[0];
    /*まとめて入力を有効にする*/
    /*アクティブに設定*/
    batchOnButton.classList.add("active");
    batchOffButton.classList.remove("active");

    /*テキストボックスクリックで入力待ちの切り替えの実装*/
    for(let i = 0 ; i < automata.numState * automata.numSign ; i++){
        let tf = document.getElementsByClassName("transition-function")[i];

        /*removeEventListenerは無名関数に対しては難しい。*/
        let addedListener = tf.addEventListener("click", function (){
            addOrRemoveClass(tf);
        
            let removeListener = batchOffButton.addEventListener("click", function (){
                tf.removeEventListener("click", addedListener, false);
                batchOffButton.removeEventListener("click", removeListener, false);
                console.log(removeListener);
            }, false);
        }, false);
    }
}

function addOrRemoveClass(tf){
    if(tf.classList.contains("waiting-for-being-input")){
        tf.classList.remove("waiting-for-being-input");
    }else{
        tf.classList.add("waiting-for-being-input");
    }
}

function batchOff(){
    let batchOnButton = document.getElementsByClassName("batch-input-on")[0];
    let batchOffButton = document.getElementsByClassName("batch-input-off")[0];
    batchOffButton.classList.add("active");
    batchOnButton.classList.remove("active");

    for(let i = 0 ; i < automata.numState * automata.numSign ; i++){
        let tf = document.getElementsByClassName("transition-function")[i];
        tf.classList.remove("waiting-for-being-input");
        /*tf.removeEventListener("click", function (){
            addOrRemoveClass(tf);
        }, false);*/
    }
}

/*まとめて入力実行関数*/
function batchInput(){
    let batchInputState = document.getElementsByClassName("batch-input-button")[0].textContent;
    let waiting = document.getElementsByClassName("waiting-for-being-input");
    for(let i = waiting.length ; i > 0 ; i--){
        waiting[i - 1].value = batchInputState; 
        waiting[i - 1].classList.remove("waiting-for-being-input");
    }
}

function setTestTransitionFunctions(){
    document.getElementsByClassName("input-first-state")[0].textContent = "q0";

    document.getElementsByClassName("state-el")[0].classList.add("accept");

    for(let i = 0 ; i < automata.numSign * automata.numState ; i++){
        document.getElementsByClassName("transition-function")[i].value = "q" + (i % automata.numState);
    }

    for(let i = 0 ; i < automata.tapeLength ; i++){
        document.getElementsByClassName("input-tape-el")[i].value =  String.fromCharCode(("a").charCodeAt(0) + (i % automata.numSign));
    }
}

/*----------読み込み時に実行。後で関数にまとめる-----------*/
setAccept();
setBatchInput();
batchOff();
/*-----------------------------------*/

function addState()
{
    if (automata.numState >= 10){
        return 0;
    }
    automata.numState++;

    /*ドロップダウンメニューに状態を追加*/
    let dropdownMenu0 = document.getElementsByClassName("dropdown-menu")[0];
    let newList0 = document.createElement("li");
    let newSpan0 = document.createElement("span");
    newSpan0.textContent = "q" + (automata.numState - 1);
    newSpan0.className = "dropdown-item";
    newSpan0.classList.add("first-state-el-" + (automata.numState - 1));
    newSpan0.setAttribute("v-on:click", "setFirstState('q" + (automata.numState - 1) + "')");
    newList0.appendChild(newSpan0);
    dropdownMenu0.appendChild(newList0);

    let dropdownMenu1 = document.getElementsByClassName("dropdown-menu")[1];
    let newList1 = document.createElement("li");
    newList1.className = "dropdown-item";
    newList1.className = "batch-input-state";
    dropdownMenu1.appendChild(newList1);

    //*行のヘッダー*/
    let newTd = document.createElement("td");
    newTd.className = "state-el";
    newTd.textContent = "q" + (automata.numState - 1);
    let parent = document.getElementsByClassName("state")[0];
    parent.appendChild(newTd);

    for(let i = 1 ; i <= automata.numSign ; i++){
        parentNode = document.getElementsByClassName("tr" + i)[0];
        let newTd2 = document.createElement("td");
        let newInput = document.createElement("input");

        //テキストボックスの詳細設定
        newInput.type = "text";
        newInput.className = "transition-function";
        newInput.size = "5";
        newInput.maxlength = "40";
        newTd2.appendChild(newInput);

        parentNode.appendChild(newTd2);
    }
}

function removeState(){
    if(automata.numState <= 1){
        return 0;
    }

    let parentStateEl = document.getElementsByClassName("state-el")[automata.numState - 1].parentNode;
    parentStateEl.removeChild(document.getElementsByClassName("state-el")[automata.numState - 1]);

    for(let i = 1 ; i <= automata.numSign ; i++){
        let parent = document.getElementsByClassName("tr" + i)[0];
        parent.removeChild(parent.lastElementChild);
    }
    automata.numState--;
}

function addSign()
{
    if (automata.numSign >= 10){
        return 0;
    }

    automata.numSign++;
    
    let parent = document.getElementsByClassName("state")[0].parentNode;
    let newTr = document.createElement("tr");
    newTr.className = "tr" + automata.numSign;
    parent.appendChild(newTr);

    let newSignTd = document.createElement("td");
    newSignTd.className = "input-sign";
    newSignTd.textContent = String.fromCharCode(("a").charCodeAt(0) + automata.numSign - 1);
    newTr.appendChild(newSignTd);
    
    for (let i = 0 ; i < automata.numState ; i++){
        let newTd = document.createElement("td");
        //テキストボックスの動的生成
        let newInput = document.createElement("input");
        //テキストボックスの詳細設定
        newInput.type = "text";
        newInput.className = "transition-function";
        newInput.size = "5";
        newInput.maxlength = "40";

        newTd.appendChild(newInput);
        newTr.appendChild(newTd);
    }
}

function removeSign(){
    if(automata.numSign <= 1){
        return 0;
    }
    document.getElementsByClassName("tr" + automata.numSign)[0].parentNode.removeChild(document.getElementsByClassName("tr" + automata.numSign)[0]);
    automata.numSign--;
}