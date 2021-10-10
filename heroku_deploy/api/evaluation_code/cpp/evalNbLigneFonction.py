import re

PATERN_VARIABLE = [
    r'[A-Za-z0-9_]{1,}\s{1,}[A-Za-z0-9_]{1,}\s*',
    r'[A-Za-z0-9_]{1,}\s{0,}<[A-Za-z0-9_]{1,}>\s{0,}[A-Za-z0-9_]{1,}',
    r'[A-Za-z0-9_]{1,}\s{1,}[A-Za-z0-9_]{1,}\s{1,}[A-Za-z0-9_]{1,}',

    r'[A-Za-z0-9_]{1,}\s{1,}[A-Za-z0-9_]{1,}\s{0,};',
    r'[A-Za-z0-9_]{1,}\s*<[A-Za-z0-9_]{1,}>\s*[A-Za-z0-9_]{0,};',
    r'[A-Za-z0-9_]{1,}\s{1,}[A-Za-z0-9_]{1,}\s{1,}[A-Za-z0-9_]{0,};',
]



def find_function(line):
    """
    :param: line: représente le code à analyser
    :return retourne les différents blocks représentant ce code (fonction while for if ..)
    """

    blockCodes = []
    i = 0
    cptAcollade = 0
    newBlock=""
    addAblock = False

    while i < len(line):

        if line[i] == "{":

            cptAcollade += 1
            newBlock += line[i]
            addAblock = True
            i +=1

        while cptAcollade != 0 and newBlock != "" and i < len(line):

            if line[i] == "{":
                cptAcollade += 1

            elif line[i] == "}":
                cptAcollade -= 1

            if addAblock:
                newBlock += line[i]

            if cptAcollade == 0:

                blockCodes.append(newBlock)
                newBlock = ""
            i +=1

        i +=1

    return blockCodes











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


def excecEvalNbLigneFonction(filin):

    listFunction = []
    listVariableRename = []
    lastListVariableRename = []

    listVarBlock = []
    lignes = filin.readlines()
    
    scopeCodeUser = False
    firstInsert = False
    long_comment = False

    lignesCompacte = ""
    newBlock = []
    functionCode = ""

    lignes = remove_comentary(lignes)

    for ligne in lignes:

        if "#include" not in ligne and "using namespace" not in ligne:
                lignesCompacte +=ligne


    listFunctionCode = find_function(lignesCompacte)

    cpt_error = 0
    for function in listFunctionCode:
        function = function.replace(" ","")
        cpt_ligne = function.count('\n')-1


        table_rm = function.split('\n')
        cpt_rm = 0

        for ligne in table_rm:
            ligne = ligne.replace(" ","")
            if len(ligne) ==0:
                cpt_rm +=1

        if cpt_ligne-cpt_rm > 30:
            cpt_error+=1
    filin.close()
    return cpt_error
