copy_from_yesteday =  async (strMatch, strExlusion) => {
    
    let currentFile = this.app.workspace.getActiveFile();
    let today = new Date(currentFile.basename+ "T12:00");
    console.log(today);
    let yesterday = new Date(today);    
    
    let mapHistory = new Map();

    //Get our files
    const files = this.app.vault.getMarkdownFiles();

    //Build our a search history 
    let historySearchCount = 10;
    for(let i = 0 ; i < historySearchCount; i++)
    {
        yesterday.setDate(yesterday.getDate() - 1 );
        
        let strYesterday = `${yesterday.getFullYear()}-${("0" + (yesterday.getMonth() + 1)).slice(-2)}-${("0" + yesterday.getDate()).slice(-2)}`;
        mapHistory.set(strYesterday, { name: strYesterday, index: i, "date" : new Date(yesterday), file: null});
    }

    //Search through out files for most recent
    let bestMatchedIndex = 999999;
    var bestMatchedFile = null;
    for (let i = 0; i < files.length; i++) {
        let path = files[i].path;
        let pastFile = path.substr(path.lastIndexOf("/")+ 1).replace('.md',''); 
 
        //Match our date map
        mapHistory.forEach((hist) => {
            if(pastFile == hist.name)
            {
                hist.file = files[i];
                if(hist.index < bestMatchedIndex)
                {
                    bestMatchedIndex = hist.index;
                    bestMatchedFile = files[i];
                }
            }
        });

    }

    
    console.log(bestMatchedFile.path);
    let text = await this.app.vault.read(bestMatchedFile);
    
    let arrLines = text.split('\n');
    let strCopyLines = "";
    let copyOn = false;
    for(line of arrLines)
    {   
        console.log(`${copyOn? "Copying": "Not Copying"}: ${line}`);
        if(copyOn && line.indexOf(strExlusion) == -1 && line.indexOf("<hr>") == -1)
            strCopyLines += line + "\n"
        if(line.indexOf(`${strMatch}`) > -1)
        {
            console.log(line);
            copyOn = true;
        }
        if(line.indexOf("<hr>") > -1 && copyOn == true)
        {
            copyOn = false;
        }
        
    }

    return(strCopyLines);   
 ;
}


module.exports = copy_from_yesteday;
