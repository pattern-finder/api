import re


PATERN_VARIABLE = [
    r'[A-Za-z0-9_]{1,}\s{1,}[A-Za-z0-9_]{1,}\s*',
    r'[A-Za-z0-9_]{1,}\s*<[A-Za-z0-9_]{1,}>\s*[A-Za-z0-9_]{1,}',
    r'[A-Za-z0-9_]{1,}\s{1,}[A-Za-z0-9_]{1,}\s{1,}[A-Za-z0-9_]{1,}',
]


def findVariableInFuction(line):
    listVariable = []
    cpt = 0
    inFunction = False

    listContentinit = []
    listVarInFunction = ""

    for signe in line:

        if signe == "(":
            cpt +=1
            inFunction = True

        elif signe == ")":
            cpt -=1

        if inFunction:
            if True and cpt > 0 and signe != "(":
                listVarInFunction += signe

            else:
                listContentinit.append(listVarInFunction)
                listVarInFunction = ""


    listContentSplit = []
    listContentSplit2 = []

    for functionContent in listContentinit:
        functionContent = functionContent.replace(',', ', ')
        x = functionContent.split(", ")

        for content in x:

            listContentSplit2.append(content)
            if not set('~!@#$%^&*()+.{}":;\'+$').intersection(content):

                if "[" in content:
                    newContent = ""
                    id=0
                    finishExtractVarFromTable = False

                    while id < len(content) and not finishExtractVarFromTable:
                        if content[id] == "[":
                            finishExtractVarFromTable = True

                        else:
                            newContent += content[id]
                        id +=1

                    content = newContent+"[]"

                if re.search(PATERN_VARIABLE[0], content) != None or re.search(PATERN_VARIABLE[1], content) != None or re.search(PATERN_VARIABLE[2], content) != None:

                        listContentSplit.append(content)


    for varaiblePart in listContentSplit:

        if ">" in varaiblePart:
            parts = varaiblePart.split(">")
            parts[len(parts)-2] +=">"
        else:
            parts = varaiblePart.split(" ")

        i = 0
        type=""

        while i < len(parts) -1:
            type = type+parts[i]
            i +=1

        type = re.sub(' ', '', type)
        variable = re.sub(' ', '', parts[len(parts)-1])

        listVariable.append(variable)


    return listVariable



def findVariableDeclare(ligne):
    """
    :param ligne: représente une ligne de code
    :return: retour le la liste des variable au seins d'une fonction
    """

    listVariable = []
    type = ""
    list = []

    if True:
        i = 0
        find = False

        while i < len(ligne) and not find:

            if ligne[i] == "=":

                notFind = True
                findSeparator = True
                permissionParcourtWord = False

                k = i
                var = ""
                typeVar = ""
                listVariableTransition = []
                inTab = False

                while k > 0 and notFind:

                    if ligne[k] == " ":
                        permissionParcourtWord = False

                        if var != "":
                            listVariableTransition.append(var)

                            var = ""

                    if ligne[k] == ",":

                        findSeparator = True
                        permissionParcourtWord = False

                        if var != "":
                            listVariableTransition.append(var)

                            var = ""


                    if ligne[k] == "[":
                        inTab = False


                    #Si on trouve un signe arpès avoir trouvé un séparateur ou qu'on est en train de parcourir un mot
                    if ligne[k] != "," and ligne[k] != " " and k != i and not inTab:

                        if findSeparator or permissionParcourtWord:
                            findSeparator = False
                            permissionParcourtWord = True
                            var = ligne[k]+var

                        else:
                            notFind = False

                    if ligne[k] == "]":
                        inTab= True

                    if not notFind:
                        type = ""
                        while k > 0 and ligne[k] != " ":
                            type = ligne[k]+type
                            k -=1


                        for variable in listVariableTransition:
                            if not set('[~!@#$%^&*()+.{}":;\']+$').intersection(type) and not set('~!@#$%^&*()+.{}":;\'+$').intersection(variable) :
                                type = re.sub(' ', '', type)
                                variable = re.sub(' ', '', variable)
                                typeVar = variable

                                if typeVar not in listVariable:
                                    listVariable.append(typeVar)

                    k -= 1

            elif ligne[i] == ";" and "=" not in ligne:
                line=""
                line = re.findall(r'\s{0,}[A-Za-z0-9_]{1,}\s{1,}[A-Za-z0-9_]{1,};', ligne)

                if line != [] and "return" not in line[0]:

                    line = re.sub(';', '', line[0])
                    ligneTab = line.split(" ")

                    u = 0
                    type = ""
                    var = ""
                    while u<len(ligneTab) and line != "":
                        if ligneTab[u] != '':
                            if type == '':
                                type = ligneTab[u]
                            else:
                                var = ligneTab[u]
                        u +=1
                    type = re.sub(' ', '', type)
                    var = re.sub(' ', '', var)

                    typeVar = var

                    if typeVar not in listVariable:
                        listVariable.append(typeVar)

            i += 1

    return listVariable





def switch(variable):
    switcher = {
        len(variable) == 1: 1,              #teste si une varaible contient plus d'une lettre
        re.search(r'[A-Z]', variable[0]) != None and re.search(r'[A-Z]{'+str(len(variable))+',}', variable) == None : 1,  #teste si une varaible commence par une majuscule t que cette variable n'est pas unee constante
        variable.lower() != variable and re.search(r'[A-Z]{' + str(len(variable)) + ',}', variable) == None: 1,

    }


    return switcher.get(True, 0)



def remove_comentary(lignes):
    """
    :param liste_variable: représente la liste des variables du code
    :return: retourne la liste des variables après avoir ajouté un espace après le type de la variable. Permet de différencier les types Matrice et collection<Matrice>
    """
    long_comment = False
    code_without_comentary = []

    for ligne in lignes:

        if "//" in ligne:
            tab_line = ligne.split("//")
            code_without_comentary.append(tab_line[0])

        elif "/*" in ligne and "*/" in ligne:
            tab_line1 = ligne.split("/*")
            tab_line2 = ligne.split("*/")
            new_line = tab_line1[0] + tab_line2[len(tab_line2)-1]
            code_without_comentary.append(new_line)

        elif "/*" in ligne:
            tab_line = ligne.split("/*")
            code_without_comentary.append(tab_line[0])
            long_comment = True

        elif "*/" in ligne:
            tab_line = ligne.split("*/")
            code_without_comentary.append(tab_line[len(tab_line)-1])
            long_comment = False

        elif not long_comment:
            code_without_comentary.append(ligne)

    return code_without_comentary


def excecEvalVariableName(filin):

    lignes = filin.readlines()
    
    scopeCodeUser = False
    cpt = 0
    scopeCodeUser = False
    cpt = 0

    lignesCompacte = ""
    listVariable = []
    lignes = remove_comentary(lignes)

    for ligne in lignes:

            ligne = ligne.replace('\n', '')

            variable = ""
            variableDeclare = findVariableDeclare(ligne)

            for variable in variableDeclare:
                if variable != "" and variable not in listVariable:
                    if not set('<>+-*~!@#$%^&*().{}":;\'+$').intersection(variable):
                        listVariable.append(variable)

            variable = ""
            functionListVariable = findVariableInFuction(ligne)

            i = 0
            while i < len(functionListVariable):
                if functionListVariable[i] not in listVariable and functionListVariable[i] != "":
                    if not set('<>+-*~!@#$%^&*().{}":;\'+$').intersection(functionListVariable[i]):
                        listVariable.append(functionListVariable[i])
                i += 1


            lignesCompacte +=ligne


    error = 0
    for var in listVariable:
        error = error + switch(var)


    ###RESULTAT
    return error

