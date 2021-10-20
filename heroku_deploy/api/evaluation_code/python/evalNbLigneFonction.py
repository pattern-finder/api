import re


def find_function(lines):
    """
    :param: line: représente le code à analyser
    :return retourne les différents blocks représentant ce code (fonction while for if ..)
    """

    blockCodes = []
    i = 0
    newBlock=""
    addAblock = False

    for line in lines:
        i = 0
        while i < len(line):

            if len(line)>i+4:
                if line[i] == "d":
                    if line[i+1] == "e":
                        if line[i + 2] == "f":
                            if line[i + 3] == " ":

                                if newBlock != "":
                                    blockCodes.append(newBlock)
                                    newBlock=""

            newBlock += line[i]
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




def excecEvalNbLigneFonction(lignes):

    listFunction = []
    listVariableRename = []
    lastListVariableRename = []

    listVarBlock = []

    scopeCodeUser = False
    firstInsert = False

    lignesCompacte = []
    newBlock = []
    functionCode = ""
    listVarToRename = []

    lignes = remove_comentary(lignes)

    for ligne in lignes:

            lignesCompacte.append(ligne)

    functionCodes = find_function(lignesCompacte)


    cpt_error = 0
    for function in functionCodes:

        cpt_ligne = 0
        cpt_ligne = function.count("\n")

        table_rm = function.split('\n')
        cpt_rm = 0
        for ligne in table_rm:
            ligne = ligne.replace(" ", "")
            if len(ligne) == 0:
                cpt_rm += 1

        if cpt_ligne-cpt_rm > 30:
            cpt_error +=1

    return cpt_error
