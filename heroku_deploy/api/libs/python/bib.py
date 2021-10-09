import cv2 as cv
from PIL import Image
import os

class Matrice:
    def __init__(self, size):
        self.size = size
        self.matrice_content = None




    def getSize(self):
        return self.size

    def getPixel(self, x, y):

        return self.matrice_content[y][x]


    def getMatriceContent(self):
        return self.matrice_content


    def initContent(self, matrice):

        matrice_content = []


        y = 0
        while y < self.getSize():

            ligne = []

            x = 0
            while x < self.getSize():
                red = matrice[y][x][0]
                green = matrice[y][x][1]
                blue = matrice[y][x][2]
                color = (red, green, blue)

                pixel = Pixel(x, y, color)
                ligne.append(pixel)
                x +=1


            matrice_content.append(ligne)
            y+=1

        self.matrice_content = matrice_content


    def toStringColor(self):

        for line in self.matrice_content:
            print(self.getLineColor(line, 0))


    def getLineColor(self, line, pos):

        if pos < len(line):
            return str(line[pos].getColor()) + self.getLineColor(line, pos+1)

        else:
            return ""



    def toStringPixel(self):

        for line in self.matrice_content:
            print(self.getLinePixel(line, 0))


    def getLinePixel(self, line, pos):

        if pos < len(line):

            if line[pos].getColor() != (255, 255, 255):
                return " " + str(0) + " " + self.getLinePixel(line, pos+1)

            else:
                return " " + str(1) + " " + self.getLinePixel(line, pos+1)

        else:
            return ""






class Pixel:
    def __init__(self, x, y, color):
        self.x = x
        self.y = y
        self.color = color

    def getX(self):
        return self.x

    def getY(self):
        return self.y

    def getColor(self):
        return self.color

    def getColorRed(self):
        return self.color[0]

    def getColorGreen(self):
        return self.color[1]

    def getColorBlue(self):
        return self.color[2]


    def compare(self, pixel):

        return self.getColorRed() == pixel.getColorRed() and self.getColorGreen() == pixel.getColorGreen() and self.getColorBlue() == pixel.getColorBlue()





class Opencv:
    def __init__(self, nameExercice):
        self.nameExercice = nameExercice
        self.numberImage = 0
        self.listPatternInit = []
        self.nbMatriceResult = 0
        self.sizeImage = 0



    def setNumberImageResultat(self, nbMatriceResult):
        self.nbMatriceResult = nbMatriceResult

    def initSizeImages(self):
        img = Image.open("./pictures/option1.png")
        self.sizeImage = img.size[0]


    def getNumberImage(self):

        PATH = "pictures/"
        print(os.getcwd())
        cpt = 0
        for image in os.listdir(PATH):
            if image.endswith(".png"):
                cpt += 1

        self.numberImage = cpt - self.nbMatriceResult


    def extractImage(self):

        i = 1

        while i <= self.numberImage:
            img = cv.imread("./pictures/option"+str(i)+".png")
            i += 1

            self.listPatternInit.append(img)


    def initExercice(self, size_matrice):
        newListPattern=[]

        for pattern in self.listPatternInit:
            newMatrice = Matrice(size_matrice)
            newMatrice.initContent(pattern)

            newListPattern.append(newMatrice)

        return newListPattern


    def matriceResult(self,size_matrice):

        img = cv.imread("./pictures/result.png")
        resultMatrice = Matrice(size_matrice)
        resultMatrice.initContent(img)

        return resultMatrice


class Exercice:

    def __init__(self, resultat, nameExercice):
        self.resultat = resultat
        self.nameExercice = nameExercice



    def assertRes(self,solution_user, resultat):
        if solution_user == resultat:
            return "SUCCESS"
        else:
            return "ERROR"




