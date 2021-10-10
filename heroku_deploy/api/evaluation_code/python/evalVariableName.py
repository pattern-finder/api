import re



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

                elif variable not in listVariable:
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

                        if var != "" and var not in listVariable:
                            listVariable.append(var)
                            var = ""

                    if ligne[k] == ",":

                        findSeparator = True
                        permissionParcourtWord = False

                        if var != "" and var not in listVariable:
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

def findVariableFromList(line):

    i = 0
    if line.count(' in ') > 0:
        variable = ""
        find = False
        findSpace = False

        while i < len(line):

            if line[i] == "i" and i+4 <= len(line):

                if i-1 > 0:

                    if line[i-1] == " ":

                        if line[i+1] == "n" and line[i+2] == " ":
                            find = True

            if not find:

                if line[i] != " ":

                    if findSpace:
                        findSpace = False
                        variable = ""

                    variable += ligne[i]

                else:
                    findSpace = True

            else:
                return variable

            i +=1

    return ""



def switch(variable):
    switcher = {
        len(variable) == 1: 1,              #teste si une varaible contient plus d'une lettre
        variable.lower() != variable and re.search(r'[A-Z]{' + str(len(variable)) + ',}',variable) == None : 1,  #teste si une varaible commence par une majuscule

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

        if "#" in ligne:
            tab_line = ligne.split("#")
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




def excecEvalVariableName():

    filin = open("userCode.py", "r")
    lignes = filin.readlines()
    scopeCodeUser = False
    cpt = 0

    listVariable = []

    lignes = remove_comentary(lignes)

    for ligne in lignes:
            print(ligne)

            variables = ""
            variables = findVariableDeclare(ligne)

            for variable in variables:

                if variables != "" and variable not in listVariable:
                    if not set('[=<>+-*~!@#$%^&*().{}":;\']+$').intersection(variable):
                        listVariable.append(variable)



            variable = ""
            functionListVariable = findVariableInFuction(ligne)

            i = 0
            while i < len(functionListVariable):
                if functionListVariable[i] not in listVariable:
                    if not set('[=<>+-*~!@#$%^&*().{}":;\']+$').intersection(functionListVariable[i]):
                        listVariable.append(functionListVariable[i])
                i +=1

            variableFromList = findVariableFromList(ligne)

            if variableFromList != "" and variableFromList not in listVariable:
                if not set('[=~!@#$%^&*()+.{}":;\']+$').intersection(variableFromList):
                    listVariable.append(variableFromList)


    error = 0
    print(listVariable)
    for var in listVariable:
        error = error + switch(var)


    ###RESULTAT
    filin.close()
    return error
