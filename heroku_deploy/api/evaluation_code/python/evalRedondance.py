import re

PATERN_VARIABLE = [
    r'[A-Za-z0-9_]{1,}\s{1,}[A-Za-z0-9_]{1,}\s*',
    r'[A-Za-z0-9_]{1,}\s{0,}<[A-Za-z0-9_]{1,}>\s{0,}[A-Za-z0-9_]{1,}',
    r'[A-Za-z0-9_]{1,}\s{1,}[A-Za-z0-9_]{1,}\s{1,}[A-Za-z0-9_]{1,}',

    r'[A-Za-z0-9_]{1,}\s{1,}[A-Za-z0-9_]{1,}\s{0,};',
    r'[A-Za-z0-9_]{1,}\s*<[A-Za-z0-9_]{1,}>\s*[A-Za-z0-9_]{0,};',
    r'[A-Za-z0-9_]{1,}\s{1,}[A-Za-z0-9_]{1,}\s{1,}[A-Za-z0-9_]{0,};',
]



def findVariableInFuction(line):
    listVariable = []
    variable = ""

    i = 0
    if line.count('def') > 0:
        start = False
        end = False

        while i < len(line):

            if line[i] == "(":
                start = True
                i=i+1


            if start and not end:

                if line[i] != "," and line[i] != ")":

                    if line[i] != " ":
                        variable += line[i]

                else:
                    listVariable.append(variable)
                    variable = ""

            if line[i] == ")":
                end = True

            i +=1

    return listVariable




def findVariableDeclare(ligne):
    listVariable = []

    if "=" in ligne:
        i = 0
        find = False

        while i < len(ligne) and not find:
            if ligne[i] == "=":

                notFind = True
                findSeparator = True
                permissionParcourtWord = False

                k = i
                var = ""
                while k > 0 and notFind:

                    if ligne[k] == " ":
                        permissionParcourtWord = False

                        if var != "":
                            listVariable.append(var)
                            var = ""

                    if ligne[k] == ",":

                        findSeparator = True
                        permissionParcourtWord = False

                        if var != "":
                            listVariable.append(var)
                            var = ""


                    if ligne[k] != "," and ligne[k] != " " and k != i:

                        if findSeparator or permissionParcourtWord:
                            findSeparator = False
                            permissionParcourtWord = True
                            var = ligne[k]+var

                        else:
                            notFind = False

                    k -= 1

            i += 1

    if " in " in ligne:
        findIn = False
        notFind = True
        permissionParcourtWord = False

        p = 0
        while p < len(ligne) and notFind:
            if len(ligne) > p + 3:
                if ligne[p] == " ":
                    if ligne[p+1] == "i":
                        if ligne[p + 2] == "n":
                            if ligne[p + 3] == " ":
                                findIn = True

            if findIn:
                var = ""
                m=p
                while m > 0:

                    if ligne[m] != " ":
                        if not permissionParcourtWord:
                            permissionParcourtWord = True

                    elif permissionParcourtWord:
                        notFind = False
                        permissionParcourtWord = False

                        if var != "" and var not in listVariable:
                            listVariable.append(var)

                    if permissionParcourtWord and notFind:
                        var = ligne[m]+var



                    m -=1

            p +=1



    return listVariable


def update_block(newBlock, blockCodes):
    if newBlock in blockCodes:
        blockCodes[newBlock] += 1

    else:
        blockCodes.update({newBlock: 1})

    return blockCodes


def find_indentation(line):

    cpt = 0
    while cpt < len(line):

        symbole = line[cpt]

        if symbole == " ":
            cpt +=1

        elif symbole == "":
            return 0

        elif symbole == "\n":
            return 0

        elif symbole == "#":
            return 0

        else:
            return cpt


    return cpt


def find_block(code):
    """
    :param: line: représente le code à analyser
    :return retourne les différents blocks représentant ce code (fonction while for if ..)
    """
    listBlock = []
    i = 0
    lastIndentationValue=0
    currentIndentationValue = 0
    blockCodes = ""
    save=0

    for line in code:

        sanitize_line = line.replace(" ", "")
        sanitize_line = sanitize_line.replace("\n", "")

        if len(sanitize_line) > 0:

            lastIndentationValue = save
            currentIndentationValue = find_indentation(line)

            if currentIndentationValue > lastIndentationValue :

                k=i


                blockCreate = False
                blockCodes = ""
                save = find_indentation(line)
              #  print("START")

                while not blockCreate and k < len(code):

                    sanitize_line = code[k].replace(" ", "")
                    sanitize_line = sanitize_line.replace("\n", "")

                    if len(sanitize_line) > 0:
                    #    print(code[k])
                  #      print(len(sanitize_line))

                 #       print("next")

                        linebis = code[k]
                        newVal = find_indentation(linebis)

                        if newVal != -1:
                            currentIndentationValue = newVal


                            if currentIndentationValue > lastIndentationValue:
                                blockCodes = blockCodes+linebis


                            else:
                                blockCreate = True

                    k +=1

                listBlock.append(blockCodes)

            else:
                if  find_indentation(line) != -1:
                    save = find_indentation(line)

        i +=1


    return listBlock




def find_function(line):
    """
    :param: line: représente le code à analyser
    :return retourne les différents blocks représentant ce code (fonction while for if ..)
    """

    blockCodes = []
    i = 0
    newBlock=""
    addAblock = False

    while i < len(line):

        if len(line)>i+4:
            if line[i] == "d":
                if line[i+1] == "e":
                    if line[i + 1] == "f":
                        if line[i + 1] == " ":

                            if newBlock != "":
                                blockCodes.append(newBlock)
                                newBlock=""

        newBlock += line[i]
        i +=1

    return blockCodes

def line_is_comment(line):
    line.replace(" ","")

    if len(line)>0:
        if line[0] == "#":
            return True
        else:
            return False





def rename_variable(line, listVariableRename):

    i = 0
    var = "var"
    lineIndentation = find_indentation(line)

    a = 0
    espace = ""
    while a < lineIndentation:
        espace += " "
        a +=1

    for variable in listVariableRename:

                    ###gestion var++ et var--
                    line = re.sub(r'\s{0,}'+variable+r'\s{0,}\+\+', var+"="+var+"+1", line)
                    line = re.sub(r'\s{0,}'+variable+r'\s{0,}\-\-', var+"="+var+"-1", line)

                    line = re.sub(r'\s{1,}'+variable+r'\s{1,}', var, line)

                    ###gestion de opérateur mathématique
                    line = re.sub(r'\s{0,}'+variable+r'\s{0,}-', var+"-", line)
                    line = re.sub(r'\s{0,}'+variable+r'\s{0,}\+', var+"+", line)
                    line = re.sub(r'\s{0,}'+variable+r'\s{0,}\*', var+"*", line)
                    line = re.sub(r'\s{0,}'+variable+r'\s{0,}\\', var+"|divide|", line)
                    line = re.sub(r'\s{0,}'+variable+r'\s{0,}=', var+"=", line)

                    ###gestion des symbile []
                    line = re.sub(r'\[\s{0,}'+variable+r'\s{0,}\]', "["+var+"]", line)

                    ###gestion de symbole ;
                  #  line = re.sub(r'\s{0,}'+variable+r'\s{0,};', var+";", line)

                    ###gestion de symbole .
                    line = re.sub(r'\s{0,}'+variable+r'\s{0,}\.', var+".", line)

                    ###gestion de symbole [
                    line = re.sub(r'\s{0,}'+variable+r'\s{0,}\[', var+"[", line)
                #    line = re.sub(r'=\s{0,}'+variable+r'\s{0,}\[int\]', type+"[", line)

                    ###gestion des symboles < >
                    line = re.sub(r'\s{0,}'+variable+r'\s{0,}<', var+"<", line)
                    line = re.sub(r'\s{0,}'+variable+r'\s{0,}>', var+">", line)
                    line = re.sub(r'>\s{0,}'+variable+r'\s{0,}>', ">"+var+">", line)
                    line = re.sub(r'<\s{0,}'+variable+r'\s{0,}<', "<"+var+"<", line)
                  #  line = re.sub(r'>\s{0,}'+variable+r'\s{0,}<', ">"+var+"<", line)
                  #  line = re.sub(r'<\s{0,}'+variable+r'\s{0,}>', "<"+var+">", line)

                    ###gestion du séparateur ","
                    line = re.sub(r'\s{0,}'+variable+r'\s{0,},', var+",", line)
                    line = re.sub(r',\s{0,}'+variable+r'\s{0,},', ","+var+",", line)
                    line = re.sub(r',\s{0,}'+variable+r'\s{0,}=', ","+var+"=", line)
                    line = re.sub(r',\s{0,}'+variable+r'\s{0,}\)', ","+var+")", line)

                    ###gestion des symbole ( )
                    line = re.sub(r'\s{0,}'+variable+r'\s{0,}\)', var+")", line)
                    line = re.sub(r'\(\s{0,}'+variable+r'\s{0,},', "("+var+",", line)
                    line = re.sub(r'\(\s{0,}'+variable+r'\s{0,}\)', "("+var+")", line)
                    line = re.sub(r'\s{0,}'+variable+r'\s{0,}!', var+"!", line)
                    line = re.sub(r'\s{0,}'+variable+r'\s{0,}<', var+"<", line)
                    line = re.sub(r'\s{0,}'+variable+r'\s{0,}>', var+">", line)

                    line = re.sub(r'\s{0,}'+variable+r'\s{0,}:', var+":", line)


    return line



def sanitize_dict_(dict):
    """
    :param liste_variable: représente la liste des variables du code
    :return: retourne la liste des variables après avoir ajouté un espace après le type de la variable. Permet de différencier les types Matrice et collection<Matrice>
    """

    sanitize_dict = {}

    for block in dict:
      #  print(block)
        sanitizeBlock = block.replace('\n', ';@;')
        sanitizeBlock = sanitizeBlock.replace(' ', '')
        sanitize_dict = update_block(sanitizeBlock, sanitize_dict)

    return sanitize_dict



def remove_comentary(lignes):
    """
    :param liste_variable: représente la liste des variables du code
    :return: retourne la liste des variables après avoir ajouté un espace après le type de la variable. Permet de différencier les types Matrice et collection<Matrice>
    """
    long_comment = False
    code_without_comentary = []

    for ligne in lignes:

        if "#" in ligne:
            tab_line = ligne.split("#")

            if "\n" not in tab_line[0]:
                tab_line[0] = tab_line[0] + "\n"

            code_without_comentary.append(tab_line[0])

        elif ligne.count("\"\"\"") == 2:
            tab_line = ligne.split("\"\"\"")
            new_line = tab_line[0] + tab_line[len(tab_line)-1]
            code_without_comentary.append(new_line)

        elif "\"\"\"" in ligne:
            tab_line = ligne.split("\"\"\"" )
            code_without_comentary.append(tab_line[0])
            long_comment = not long_comment

        elif "\"\"\"" in ligne:
            tab_line = ligne.split("\"\"\"" )
            code_without_comentary.append(tab_line[len(tab_line)-1])
            long_comment = not long_comment

        elif not long_comment:
            code_without_comentary.append(ligne)

    return code_without_comentary


def excecEvalRedondance():

    listFunction = []
    listVariableRename = []
    lastListVariableRename = []

    listVarBlock = []
    filin = open("userCode.py", "r")
    lignes = filin.readlines()

    scopeCodeUser = False
    firstInsert = False

    lignesCompacte = []
    newBlock = []
    functionCode = ""
    listVarToRename = []

    lignes = remove_comentary(lignes)

    for ligne in lignes:

            if not line_is_comment(ligne):
                ligneBis = ligne

                listeVarInitFunction = findVariableInFuction(ligne)
                listeVarContentFunction = []

                if listeVarInitFunction == []:
                    listeVarContentFunction = findVariableDeclare(ligne)

                listVarToRename = listeVarContentFunction + listeVarInitFunction

                i = 0
                while i < len(listVarToRename):

                    if listVarToRename[i] not in listVariableRename and listVarToRename[i] != "":
                        listVariableRename.append(listVarToRename[i])
                    i += 1

                lignesCompacte.append(ligneBis)



    blockCodes = find_block(lignesCompacte)


    renameBlock = []
    for block in blockCodes:
        renameBlock.append(rename_variable(block, listVariableRename))


    sanitize_dict = sanitize_dict_(renameBlock)


    cptRedondance = 0

    for block in sanitize_dict:
        print(block)


        if sanitize_dict[block] > 1:
            cptRedondance += sanitize_dict[block]-1
            
    filin.close()
    return cptRedondance

