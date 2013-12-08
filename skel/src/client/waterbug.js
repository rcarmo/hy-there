/**
(C) Bernhard Zwischenbrugger 2012

Customized by Rui Carmo on 2013-03-29 to expose Brython error values and allow Brython development on an iPad
Re-released under the MIT license
**/

var waterbug = (function (){
    var vararray=[];                
    var orientation=0;
    var debugDiv=document.createElement("div");
    debugDiv.style.position="absolute";
    debugDiv.style.top="75%";
    debugDiv.style.left="0px";
    debugDiv.style.wordWrap="break-word";
    debugDiv.style.borderTop = "1px solid blue";
    debugDiv.style.fontFamily="Menlo";
    debugDiv.style.fontSize="11px";
    debugDiv.style.cursor="default";
    debugDiv.style.backgroundColor="white";
    debugDiv.style.minHeight="300%";
    debugDiv.style.zIndex="10000";
    debugDiv.style.width="100%";

    function takeOverConsole(){
        var console = window.console
        if (!console) return
        function intercept(method){
            var original = console[method]
            console[method] = function(){
                vararray.push({type:method,message:msg});
                showValues();
                if (original.apply){
                    // Do this for normal browsers
                    original.apply(console, arguments)
                }else{
                    // Do this for IE
                    var message = Array.prototype.slice.apply(arguments).join(' ')
                    original(message)
                }
            }
        }
        var methods = ['log', 'warn', 'error']
        for (var i = 0; i < methods.length; i++)
            intercept(methods[i])
    }
    takeOverConsole();
    var log = console.log;
    console.log = push;

    element = document.getElementById('console-trigger')
    element.onclick = function() {
        window.scrollTo(1,1);    
        showValues();
    }

    window.addEventListener("error", function(error) {
        var msg = error;
        //if(error.__name__){ msg += (' ' + error.__name__)}
        //if(error.info){ msg += (' ' + error.info)}
        vararray.push({type:"error",message:msg});
        showValues();
    });

    function showValues(){
        while(debugDiv.firstChild){debugDiv.removeChild(debugDiv.firstChild)};
        document.body.appendChild(debugDiv);
                    debugDiv.style.display="block";
        for(var i=0;i<vararray.length;i++){
            var div=document.createElement("div");
            switch(vararray[i].type){
                case "log":
                    if((typeof vararray[i].message === "string") |
                       (typeof vararray[i].message === "number")) {
                        var item=formatValue(vararray[i].message);
                        item.style.verticalAlign="top";
                        item.style.padding="2px";
                        div.appendChild(item);
                    }
                    else { 
                        for(var j=0;j<vararray[i].message.length;j++){
                            var item=formatValue(vararray[i].message[j]);
                            item.style.verticalAlign="top";
                            item.style.padding="2px";
                            div.appendChild(item);
                        }
                    }
                    debugDiv.appendChild(div);
                    break;
                case "error":
                    addSpan(div,vararray[i].message.message,"red");
                    addSpan(div," "+vararray[i].message.filename+"  line: "+vararray[i].message.lineno,"gray");
                    debugDiv.appendChild(div);
                    break;
            }
            div.style.borderBottom="1px solid #eeeeee";
        }
        var evalDiv=document.createElement("div");
        var evalInput=document.createElement("input");
        evalInput.style.border="0px solid red";
        evalInput.style.width="80%";
        evalDiv.style.width="100%";
        evalInput.setAttribute( "autocorrect" , "off");    
        evalInput.setAttribute( "autocapitalize" , "none");    
        evalInput.style.borderBottom="1px solid #eeeeee";
        evalInput.addEventListener("keyup",function(evt){
            if(evt.keyCode==13){
                try{
                    var obj=eval(this.value);
                    vararray.push({type:"log",message:[obj]});
                }catch(e){
                    vararray.push({type:"error",message:[e]});
                }
                showValues();
            }
        });
        var span=document.createElement("span");
        span.appendChild(document.createTextNode(">"));
        span.style.color="lightblue";
        span.style.fontWeight="bold";
        evalDiv.appendChild(span);
        evalDiv.appendChild(evalInput);
        debugDiv.appendChild(evalDiv);
    }
    function formatValue(value){
        switch(typeof(value)){
            case "number":return showNumber(value);
                break; 
            case "string":return showString(value);
                break; 
            case "object":return showObject(value);
                break;
            default:
                return document.createTextNode(typeof(value));

        }
    }
    function showNumber(value){
        var div=document.createElement("div");
        div.appendChild(document.createTextNode(value));
        div.style.color="blue";
        div.style.display="inline";
        div.style.verticalAlign="top";
        return div;
    }
    function showString(value){
        var div=document.createElement("div");
        div.appendChild(document.createTextNode(value));
        div.style.color="black";
        div.style.display="inline";
        div.style.verticalAlign="top";
        return div;
    }
    function showTheHTML(value){
        var div=document.createElement("div");
        if(value.nodeType==3){  //textnode
            var div=document.createElement("span");
            addSpan(div,value.nodeValue);
            return div;
        }
        var div=document.createElement("div");
        if(value.nodeType==1){  //element
            addSpan(div,"<");
            addSpan(div,value.tagName.toLowerCase(),"purple");
            for(var i=0;i<value.attributes.length;i++){
                addSpan(div," ");
                addSpan(div,value.attributes[i].nodeName,"blue");
                addSpan(div,"='");
                addSpan(div,value.attributes[i].nodeValue,"blue");
                addSpan(div,"'");
            }
            addSpan(div,">");
            for(var i=0;i<value.childNodes.length;i++){
                // div.appendChild(showTheHTML(value.childNodes[i])); //to be continued
            }    
            addSpan(div," .... ");
            addSpan(div,"<");
            addSpan(div,value.tagName.toLowerCase(),"purple");
            addSpan(div,">");
        }
        div.style.color="black";
        div.style.display="inline";
        div.style.verticalAlign="top";
        return div;
    }
    function addSpan(target,text,color){
        var span=document.createElement("span");
        span.appendChild(document.createTextNode(text));
        if(color){
            span.style.color=color;
        }
        target.appendChild(span);
    }

    function showObject(value){
        var div=document.createElement("div");
        if(!value)return div;
        div.style.display="inline";
        if(value && value.nodeType){
            return showTheHTML(value);
        //    return div;
        }
        if(value.length){
            div.appendChild(document.createTextNode("["));
            for(var i=0;i<value.length;i++){
                div.appendChild(formatValue(value[i]));
                if(i<value.length -1){
                div.appendChild(document.createTextNode(","));
                }

            }
            div.style.verticalAlign="top";
            div.appendChild(document.createTextNode("]"));
        }else{
            var objDiv=document.createElement("div");
            var arrow=document.createElement("span");
            arrow.appendChild(document.createTextNode("▶  Object"));
            arrow.style.color="gray";
            objDiv.appendChild(arrow);
            objDiv.style.display="inline";
            arrow.style.fontSize="20px";
            objDiv.theObject=value;
            objDiv.expanded=false;
            objDiv.addEventListener("click",function(evt){
                if(this.expanded){
                    this.firstChild.textContent="▶  Object";
                    while(this.childNodes.length >1){
                        this.removeChild(this.lastChild);
                    }
                    this.expanded=false;
                }else{
                    var x=expandObject(this.theObject);
                    this.appendChild(x);
                    this.firstChild.textContent="▼  Object";
                    this.expanded=true;
                }
                evt.stopPropagation(); 
            },false);
            div.appendChild(objDiv);
            div.style.display="inline-block";
        }
        return div;
    }
    function expandObject(value){
        var div=document.createElement("div");
        for(var i in value){
            var nameValueDiv=document.createElement("div");
            var nameSpan=document.createElement("span");
            nameSpan.appendChild(document.createTextNode(i+":"));
            nameSpan.style.color="purple";
            nameValueDiv.appendChild(nameSpan);
            if(i!="opener"){  //error prevent
                nameValueDiv.appendChild(formatValue(value[i]));
            }
            nameValueDiv.style.verticalAlign="top";
            nameSpan.style.verticalAlign="top";
//                nameValueDiv.style.display="inline-block";
            div.appendChild(nameValueDiv);
        }
//            div.style.border="1px solid black";
        div.style.marginLeft="14px";
        return div;
    }
            function push(obj){
        //if(debugDiv.parentNode)return; //console is open, don't record events
                    vararray.push({type:"log",message:obj});
                    showValues();
            }       
            return {
                    log:function(name,value){
                            push(arguments);
                    },
        show:function(){
            showValues();
        }

            }
    })();



