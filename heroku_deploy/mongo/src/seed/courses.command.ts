// import { Injectable } from '@nestjs/common';
// import { Command } from 'nestjs-command';
// import { ChallengesService } from 'src/challenges/challenges.service';
// import { ExecBootstrapsService } from 'src/exec-bootstrap/exec-bootstraps.service';
// import { SeriesService } from 'src/series/series.service';
// import { UsersService } from 'src/users/users.service';

// export const DEFAULT_SERIE_NAME = 'Picspy Courses';
// @Injectable()
// export class CoursesCommand {
//   constructor(
//     private readonly challengeService: ChallengesService,
//     private readonly execBootstrapService: ExecBootstrapsService,
//     private readonly seriesService: SeriesService,
//     private readonly userService: UsersService,
//   ) {}

//   private readonly user = {
//     username: 'picspy',
//     password: '',
//     email: 'support@picspy.com',
//   };

//   private readonly serie = {
//     name: 'DEFAULT SERIE',
//   };

//   private readonly challenges = [
//     {
//       name: 'comparaisonMatrice',
//       instructions:"Vous disposez d'une image résultat et d'une liste d'image."+
//       "Implémentez la fonction doExercice afin de créer un algoritme capable de trouver l'image d'entrée dans la liste d'image de sortie"+
//       "Donnée: Image a trouver => matrice_result"+
//       "        Liste d'images a traiter => listMatrice"+
//       "Réponse: vous devez retourner l'id de limage dans la liste (0, 1, 2 ...) correspondant à l'image d'entrée',",

//       exebootstrapPython: {
//         language: 'python',

//         tests: `
// from lib import bib
// import cv2 as cv
// from lib.bib import Matrice, Opencv, Exercice

// // USER_CODE

// def testAlgo(nameExercice, resultat, nbMatriceResult):
//   opencv = Opencv(nameExercice)
//   opencv.setNumberImageResultat(nbMatriceResult)
//   opencv.getNumberImage()
//   opencv.extractImage()
//   opencv.initSizeImage()

//   exercice = Exercice(resultat, nameExercice)
//   listPatternInit = opencv.initExercice(opencv.sizeImage)
//   matrice_result = opencv.matriceResult(opencv.sizeImage)
//   solution_user = doExercice(listPatternInit, matrice_result)
//   return exercice.assertRes(solution_user, resultat)

// if __name__ == '__main__':
//   nameExercice = "comparaisonMatrice"
//   resultat = 2
//   nbMatriceResult = 1
//   print(testAlgo(nameExercice, resultat, nbMatriceResult))

//         `,
//         functionTemplate: `
// def doExercice(listMatrice, matriceInputToFind):
//   #implement me
//           `,
//       },

// exebootstrapCpp : {
//         language: 'cpp',
//         tests: `
//         #include <stdio.h>
//         #include <opencv2/highgui.hpp>
//         #include <string>
//         #include <iostream>
//         #include "./lib/Opencv.h"
//         #include "./lib/Exercice.h"
//         #include "./lib/Matrice.h"
//         #include "./lib/Line.h"
//         #include "./lib/Pixel.h"

//         using namespace std;
//         // USER_CODE

//         std::string testAlgo(std::string nameExercice, int resultat, int nbMatriceResult){

//           Opencv opencv = Opencv(nameExercice);
//           opencv.setNumberImageResultat(nbMatriceResult);
//           opencv.getNumberImage();
//           opencv.extractImage();
//           opencv.initSizeImage();

//           Exercice exercice = Exercice(resultat, nameExercice);
//           Exercice(resultat, nameExercice);
//           std::vector<Matrice> listPatternInit = opencv.initExercice();
//           Matrice matrice_result = opencv.matriceResult();

//           int solution_user = doExercice(listPatternInit, matrice_result);
//           return exercice.assertRes(solution_user, resultat);

//           return 0;
//       }

//       int main(int argc, char *argv[])
//       {
//           std::string nameExercice = "comparaisonMatrice";
//           int resultat = 2;
//           int nbMatriceResult = 1;

//           cout << testAlgo(nameExercice, resultat, nbMatriceResult) << endl;
//       }

//         `,
//         functionTemplate: `
// int doExercice(vector<Matrice> listPattern, Matrice result){
//     //implement me
// }
//           `,
//       }
//     },

//     {
//       name: 'comparaisonAngle',

//       instructions: " Vous disposez d'une liste d'images représentant plusieurs angles."+
//       "Implémentez la fonction doExercice afin de créer un algoritme capable de déterminer la valeur de chaque angle"+
//       "Donnée: la liste d'image dont les angles sont à calculer, la liste des pixel limite des 2 segment de chaque image et un dictionnaire python à remplire à renvoyer"+
//       "Réponse: vous devez retourner le dictionnaire contenant la valeur des angles de chaque images"
//       ,
//        exebootstrapPython : {
//         language: 'python',

//         tests: `
// import math
// import cv2 as cv
// import numpy

// from lib.bib import Pixel, Matrice, Opencv, Exercice

// def testAlgo(nameExercice, resultat, nbMatriceResult):
//   opencv = Opencv(nameExercice)
//   opencv.setNumberImageResultat(nbMatriceResult)
//   opencv.getNumberImage()
//   opencv.extractImage()
//   opencv.initSizeImage()

//    // USER_CODE

//   exercice = Exercice(resultat, nameExercice)
//   listPatternInit = opencv.initExercice(opencv.sizeImage)

//   dict_resultat = {
//       0: 0.0,
//       1: None,
//       2: 0.0,
//       3: 0.0
//   }

//   resultat_valide = {
//       0: 90.0,
//       1: None,
//       2: 45.0,
//       3: 135.0
//     }

//   isteListePixelParImage = [
//         [(4, 2), (4, 14), (19, 14)],
//         [(-1, -1), (-1, -1), (-1, -1)],
//         [(16, 2), (4, 14), (19, 14)],
//         [(4, 8), (10, 14), (19, 14)],
//     ]

//   solution_user = doExercice(listPatternInit, listeListePixelParImage, dict_resultat, opencv.sizeImage)

//   return exercice.assertRes(solution_user, resultat_valide)

// if __name__ == '__main__':

//   nameExercice = "comparaisonAngle"

//   resultat = {
//         0: 90.0,
//         1: None,
//         2: 45.0,
//         3: 135.0
//     }

//   nbMatriceResult = 0
//   print(testAlgo(nameExercice, resultat, nbMatriceResult))

//         `,
//         functionTemplate: `
// def doExercice(listPattern, listeListePixelParImage, dict_resultat, size_matrice):
//     #implement me
//           `,
//       },

//     exebootstrapCpp : {
//       language: 'cpp',
//       tests: `
//       #include <stdio.h>
//       #include <opencv2/highgui.hpp>
//       #include <string>
//       #include <iostream>
//       #include <math.h>
//       #include "./lib/Opencv.h"
//       #include "./lib/Exercice.h"
//       #include "./lib/Matrice.h"
//       #include "./lib/Line.h"
//       #include "./lib/Pixel.h"
//       using namespace std;
//       // USER_CODE

//       string testAlgo(string nameExercice, int nbMatriceResult){
//         Opencv opencv = Opencv(nameExercice);
//         opencv.setNumberImageResultat(nbMatriceResult);
//         opencv.getNumberImage();
//         opencv.extractImage();
//         opencv.initSizeImage();

//         Exercice exercice = Exercice(-1, nameExercice);
//         vector<Matrice> listPatternInit = opencv.initExercice();

//         vector<double> dict_resultat;

//         vector<double> resultat_valide;
//         resultat_valide.push_back(90.0);
//         resultat_valide.push_back(45.0);
//         resultat_valide.push_back(135.0);

//         int color1[3] = {0,0,0};
//         int color2[3] = {0,0,0};
//         int color3[3] = {0,0,0};
//         int color4[3] = {0,0,0};
//         int color5[3] = {0,0,0};
//         int color6[3] = {0,0,0};
//         int color7[3] = {0,0,0};
//         int color8[3] = {0,0,0};
//         int color9[3] = {0,0,0};
//         int color10[3] = {0,0,0};
//         int color11[3] = {0,0,0};
//         int color12[3] = {0,0,0};

//         Pixel p10 = Pixel(4,2,color1);
//         Pixel p11 = Pixel(4,14,color2);
//         Pixel p12 = Pixel(19,14,color3);
//         Line list1;
//         list1.insertPixel(p10);
//         list1.insertPixel(p11);
//         list1.insertPixel(p12);

//         Pixel p30 = Pixel(16,2,color7);
//         Pixel p31 = Pixel(4,14,color8);
//         Pixel p32 = Pixel(19,14,color9);
//         Line list3;
//         list3.insertPixel(p30);
//         list3.insertPixel(p31);
//         list3.insertPixel(p32);

//         Pixel p40 = Pixel(4,8,color10);
//         Pixel p41 = Pixel(10,14,color11);
//         Pixel p42 = Pixel(19,14,color12);
//         Line list4;
//         list4.insertPixel(p40);
//         list4.insertPixel(p41);
//         list4.insertPixel(p42);

//         vector<Line> listeListePixelParImage;
//         listeListePixelParImage.push_back(list1);
//         listeListePixelParImage.push_back(list3);
//         listeListePixelParImage.push_back(list4);

//         vector<double> solution_user = doExercice(listPatternInit, listeListePixelParImage, dict_resultat,opencv.sizeImage);

//         return exercice.assertResMult(solution_user, resultat_valide);
//     }

//     int main(int argc, char *argv[]){
//         string nameExercice = "comparaisonAngle";
//         int resultat = 0;
//         int nbMatriceResult = 0;

//         cout << testAlgo(nameExercice, nbMatriceResult) << endl;
//     }

//       `,
//       functionTemplate: `
// vector<double> doExercice(vector<Matrice> listPattern, vector<Line> listeListePixelParImage, vector<double> dict_resultat, int size_matrice){  //implement me
// //implement me
// }
//         `,
//     }
//   },

//     {
//       name: 'comparaisonCarre',

//       instructions:
//       "Consigne: Vous disposez d'une liste d'image."+
//       "Implémentez la fonction doExercice afin de créer un algoritme capable de trouver le pattern de carrée"+
//       "Donnée: Liste d'images a traiter => listMatrice"+
//       "        le centre de la figure"+
//       "Réponse: vous devez retourner l'id de limage dans la liste (0, 1, 2 ...) correspondant à un carré",

//       exebootstrapPython : {
//         language: 'python',

//         tests: `

// import cv2 as cv
// from lib.bib import Matrice, Pixel, Exercice, Opencv
// // USER_CODE

// def testAlgo(nameExercice, resultat, nbMatriceResult):
//     opencv = Opencv(nameExercice)
//     opencv.setNumberImageResultat(nbMatriceResult)
//     opencv.getNumberImage()
//     opencv.extractImage()
//     opencv.initSizeImage()

//     exercice = Exercice(resultat, nameExercice)
//     listPatternInit = opencv.initExercice(opencv.sizeImage)

//     start_X = int(opencv.sizeImage / 2) - 1
//     start_Y = int(opencv.sizeImage / 2) - 1

//     solution_user = doExercice(listPatternInit, start_X, start_Y)
//     return exercice.assertRes(solution_user, resultat)

// if __name__ == '__main__':
//     nameExercice = "comparaisonCarre"
//     resultat = 3
//     nbMatriceResult = 0
//     print(testAlgo(nameExercice, resultat, nbMatriceResult))

//         `,
//         functionTemplate: `
// def doExercice(listPattern, start_X, start_Y):
//     #implement me
//           `,
//       },

//       exebootstrapCpp : {
//         language: 'cpp',

//         tests: `
//         #include <stdio.h>
//         #include <opencv2/highgui.hpp>
//         #include <string>
//         #include <iostream>
//         #include "./lib/Opencv.h"
//         #include "./lib/Exercice.h"
//         #include "./lib/Matrice.h"
//         #include "./lib/Line.h"
//         #include "./lib/Pixel.h"

//         using namespace std;

//         // USER_CODE

//         std::string testAlgo(std::string nameExercice, int resultat, int nbMatriceResult){
//           Opencv opencv = Opencv(nameExercice);
//           opencv.setNumberImageResultat(nbMatriceResult);
//           opencv.getNumberImage();
//           opencv.extractImage();
//           opencv.initSizeImage();

//           Exercice exercice = Exercice(resultat, nameExercice);
//           vector<Matrice> listPatternInit = opencv.initExercice();

//           int start_X = int(opencv.sizeImage / 2) - 1;
//           int start_Y = int(opencv.sizeImage / 2) - 1;

//           int solution_user = doExercice(listPatternInit, start_X, start_Y);

//           return exercice.assertRes(solution_user, resultat);
//         }

//         int main(int argc, char *argv[])
//         {
//           std::string nameExercice = "comparaisonCarre";
//           int resultat = 3;
//           int nbMatriceResult = 0;

//           cout << testAlgo(nameExercice, resultat, nbMatriceResult) << endl;

//         }
//         `,
//         functionTemplate: `
//         int doExercice(vector<Matrice> listPattern, int start_X, int start_Y)
//         {
//         }
//           `,
//       }

//     },

//     {
//       name: 'comparaisonCercle',

//       instructions: "Consigne: Vous disposez d'une liste d'image."+
//       "Implémentez la fonction doExercice afin de créer un algoritme capable de trouver le pattern de cercle"+
//       "l'algorithme a utiliser est l'algorithme de tracé de cercle de bresenham"+
//       "Donnée: Liste d'images a traiter => listMatrice"+
//       "       le centre de la figure"+
//       "Réponse: vous devez retourner l'id de limage dans la liste (0, 1, 2 ...) correspondant à un cercle de bresenham,"
// ,

//       exebootstrapCpp : {
//         language: 'cpp',

//         tests: `
//         #include <stdio.h>
//         #include <opencv2/highgui.hpp>
//         #include <string>
//         #include <iostream>
//         #include "./lib/Opencv.h"
//         #include "./lib/Exercice.h"
//         #include "./lib/Matrice.h"
//         #include "./lib/Line.h"
//         #include "./lib/Pixel.h"
//         using namespace std;

//         // USER_CODE

//         string testAlgo(string nameExercice, int resultat, int nbMatriceResult){
//           Opencv opencv = Opencv(nameExercice);
//           opencv.setNumberImageResultat(nbMatriceResult);
//           opencv.getNumberImage();
//           opencv.extractImage();
//           opencv.initSizeImage();

//           Exercice exercice = Exercice(resultat, nameExercice);
//           vector<Matrice> listPatternInit = opencv.initExercice();

//           int start_X = int(opencv.sizeImage / 2);
//           int start_Y = int(opencv.sizeImage / 2);

//           int solution_user = doExercice(listPatternInit, start_X, start_Y);
//           cout << solution_user << endl;

//           return exercice.assertRes(solution_user, resultat);
//       }

//       int main(int argc, char *argv[])
//       {
//           string nameExercice = "comparaisonCercle";
//           int resultat = 3;
//           int nbMatriceResult = 0;

//           cout << testAlgo(nameExercice, resultat, nbMatriceResult) << endl;

//       }
//         `,
//         functionTemplate: `
//         int doExercice(vector<Matrice> listPattern, int start_X, int start_Y)
//         {
//           //implemente me
//           }
//           `,
//       },

//       exebootstrapPython : {
//         language: 'python',

//         tests: `

// import cv2 as cv
// import numpy

// from lib.bib import Matrice, Pixel, Opencv, Exercice

// // USER_CODE

// def testAlgo(nameExercice, resultat, nbMatriceResult):
//     opencv = Opencv(nameExercice)
//     opencv.setNumberImageResultat(nbMatriceResult)
//     opencv.getNumberImage()
//     opencv.extractImage()
//     opencv.initSizeImage()

//     exercice = Exercice(resultat, nameExercice)
//     listPatternInit = opencv.initExercice(opencv.sizeImage)

//     start_X = int(opencv.sizeImage / 2)
//     start_Y = int(opencv.sizeImage / 2)

//     solution_user = doExercice(listPatternInit, start_X, start_Y)
//     return exercice.assertRes(solution_user, resultat)

// if __name__ == '__main__':

//     nameExercice = "comparaisonCercle"
//     resultat = 3
//     nbMatriceResult = 0
//     print(testAlgo(nameExercice, resultat, nbMatriceResult))

//         `,
//         functionTemplate: `
// def doExercice(listPattern, start_X, start_Y):
//     #implement me
//           `,
//       }
//     },

//     {
//       name: 'comparaisonRemplissage',

//       instructions: "Consigne: Vous disposez d'une liste d'image."+
//       "Implémentez la fonction doExercice afin de créer un algoritme capable de trouver le pattern remplie (dont tous les pixels intèriueurs sont noir)"+
//       "Donnée: Liste d'images a traiter => listMatrice"+
//       "Réponse: vous devez retourner l'id de limage dans la liste (0, 1, 2 ...) correspondant à une forme pleine"
//       ,

// exebootstrapCpp : {
//   language: 'cpp',

//   tests: `
//   #include <stdio.h>
//   #include <opencv2/highgui.hpp>
//   #include <string>
//   #include <iostream>
//   #include "./lib/Opencv.h"
//   #include "./lib/Exercice.h"
//   #include "./lib/Matrice.h"
//   #include "./lib/Line.h"
//   #include "./lib/Pixel.h"
//   using namespace std;

//   // USER_CODE

// string testAlgo(string nameExercice, int resultat, int nbMatriceResult){
//     Opencv opencv = Opencv(nameExercice);
//     opencv.setNumberImageResultat(nbMatriceResult);
//     opencv.getNumberImage();
//     opencv.extractImage();
//     opencv.initSizeImage();

//     Exercice exercice = Exercice(resultat, nameExercice);
//     vector<Matrice> listPatternInit = opencv.initExercice();

//     int solution_user = doExercice(listPatternInit, opencv.getSizeImage());
//     cout << "SOLUTION" << endl;
//     cout << solution_user << endl;

//     return exercice.assertRes(solution_user, resultat);
// }

// int main(int argc, char *argv[])
// {
//     string nameExercice = "comparaisonRemplissage";
//     int resultat = 2;
//     int nbMatriceResult = 0;

//     cout << testAlgo(nameExercice, resultat, nbMatriceResult) << endl;

// }
//   `,

//   functionTemplate: `
// int doExercice(vector<Matrice> listPatternInit,int size_matrice){
// // implement me
// }
//     `,
// },

// exebootstrapPython : {
//   language: 'python',

//   tests: `

// import cv2 as cv

// from lib.bib import Matrice, Pixel, Opencv, Exercice

// // USER_CODE

// def testAlgo(nameExercice, resultat, nbMatriceResult):
//     opencv = Opencv(nameExercice)
//     opencv.setNumberImageResultat(nbMatriceResult)
//     opencv.getNumberImage()
//     opencv.extractImage()
//     opencv.initSizeImage()

//     exercice = Exercice(resultat, nameExercice)
//     listPatternInit = opencv.initExercice(opencv.sizeImage)

//     solution_user = doExercice(listPatternInit, opencv.sizeImage)
//     return exercice.assertRes(solution_user, resultat)

// if __name__ == '__main__':
//     nameExercice = "comparaisonRemplissage"
//     resultat = 2
//     nbMatriceResult = 0
//     print(testAlgo(nameExercice, resultat, nbMatriceResult))
//   `,

//   functionTemplate: `
// def doExercice(listPatternInit,size_matrice):
//   #implement me
//     `,
// }
//     },

//     {
//       name: 'comparaisonRotation',

//       instructions: "Consigne: Vous disposez d'une liste d'image."+
//       "Implémentez la fonction doExercice afin de créer un algoritme capable de trouver le pattern de carrée"+

//       "Donnée: Liste d'images a traiter => listMatrice"+
//               "le centre de la figure"+
//       "Réponse: vous devez retourner l'id de limage dans la liste (0, 1, 2 ...) correspondant à un carré"
//       ,

// exebootstrapCpp : {
//   language: 'cpp',

//   tests: `
//   #include <stdio.h>
//   #include <opencv2/highgui.hpp>
//   #include <string>
//   #include <iostream>
//   #include <math.h>
//   #include "./lib/Opencv.h"
//   #include "./lib/Exercice.h"
//   #include "./lib/Matrice.h"
//   #include "./lib/Line.h"
//   #include "./lib/Pixel.h"
//   using namespace std;

//   // USER_CODE

//   string testAlgo(string nameExercice, int resultat, int nbMatriceResult){
//     Opencv opencv = Opencv(nameExercice);
//     opencv.setNumberImageResultat(nbMatriceResult);
//     opencv.getNumberImage();
//     opencv.extractImage();
//     opencv.initSizeImage();

//     Exercice exercice = Exercice(-1, nameExercice);
//     vector<Matrice> listPatternInit = opencv.initExercice();

//     int start_X = 11;
//     int start_Y = 11;

//     int color1[3] = {0,0,0};
//     int color2[3] = {0,0,0};
//     int color3[3] = {0,0,0};
//     int color4[3] = {0,0,0};

//     Pixel XY1 = Pixel(4, 7, color1);
//     Pixel XY2 = Pixel(18, 7, color2);
//     Pixel XY3 = Pixel(18, 15, color3);
//     Pixel XY4 = Pixel(4, 15, color4);

//     int solution_user = doExercice(listPatternInit, XY1, XY2, XY3, XY4, start_X, start_Y);

//     return exercice.assertRes(solution_user, resultat);
// }

// int main(int argc, char *argv[]){
//     string nameExercice = "comparaisonRotation";
//     int resultat = 2;
//     int nbMatriceResult = 1;

//     cout << testAlgo(nameExercice,resultat, nbMatriceResult) << endl;
// }
//   `,
//   functionTemplate: `
// int doExercice(vector<Matrice> listMatrice, Pixel XY1, Pixel XY2, Pixel XY3, Pixel XY4,  int start_X, int start_Y){
//       //implement me

//     }
//     `,
// },

// exebootstrapPython : {
//   language: 'python',

//   tests: `

// from math import *
// from lib.bib import Matrice, Pixel, Opencv, Exercice

// // USER_CODE

// def testAlgo(nameExercice, resultat, nbMatriceResult):
//     opencv = Opencv(nameExercice)
//     opencv.setNumberImageResultat(nbMatriceResult)
//     opencv.getNumberImage()
//     opencv.extractImage()
//     opencv.initSizeImage()

//     exercice = Exercice(resultat, nameExercice)
//     listPatternInit = opencv.initExercice(opencv.sizeImage)

//     matrice_result = opencv.matriceResult(opencv.sizeImage)

//     XY1 = (4, 7)
//     XY2 = (18, 7)
//     XY3 = (18, 15)
//     XY4 = (4, 15)

//     start_X = 11
//     start_Y = 1

//     solution_user = doExercice(listPatternInit , XY1, XY2, XY3, XY4, start_X, start_Y)
//     return exercice.assertRes(solution_user, resultat)

// if __name__ == '__main__':
//     nameExercice = "comparaisonRotation"
//     resultat = 2
//     nbMatriceResult = 1
//     print(testAlgo(nameExercice, resultat, nbMatriceResult))

//   `,
//   functionTemplate: `
//   def doExercice(listMatrice, XY1, XY2, XY3, XY4,  start_X, start_Y):
//     #implement me
//     `,
// }
//     },

//     {
//       name: 'comparaisonSegment',

//       instructions: "Consigne: Vous disposez d'une liste d'image."+
//       "Implémentez la fonction doExerciceBalayage afin de créer un algoritme capable de trouver le pattern de ligne tracé par l'algo de bresenham"+
//       "Donnée: Liste d'images a traiter => listMatrice"+
//       "        Les 2 pixels aux extrémité de la figure"+
//       "Réponse: vous devez retourner l'id de limage dans la liste (0, 1, 2 ...) correspondant à une ligne tracé avec l'algo de bresenham,"
// ,

// exebootstrapCpp : {
//   language: 'cpp',

//   tests: `
//   #include <stdio.h>
//   #include <opencv2/highgui.hpp>
//   #include <string>
//   #include <iostream>
//   #include "./lib/Opencv.h"
//   #include "./lib/Exercice.h"
//   #include "./lib/Matrice.h"
//   #include "./lib/Line.h"
//   #include "./lib/Pixel.h"
//   using namespace std;

//   // USER_CODE

// string testAlgo(string nameExercice, int resultat, int nbMatriceResult){
//     Opencv opencv = Opencv(nameExercice);
//     opencv.setNumberImageResultat(nbMatriceResult);
//     opencv.getNumberImage();
//     opencv.extractImage();
//     opencv.initSizeImage();

//     Exercice exercice = Exercice(resultat, nameExercice);
//     vector<Matrice> listPatternInit = opencv.initExercice();

//     int color1[3] = {0,0,0};
//     int color2[3] = {0,0,0};
//     int color3[3] = {0,0,0};
//     int color4[3] = {0,0,0};
//     int color5[3] = {0,0,0};
//     int color6[3] = {0,0,0};
//     int color7[3] = {0,0,0};
//     int color8[3] = {0,0,0};

//     Pixel pStart0 = Pixel(13,4,color1);
//     Pixel pStart1 = Pixel(13,4,color2);
//     Pixel pStart2 = Pixel(13,4,color3);
//     Pixel pStart3 = Pixel(16,7,color4);
//     vector<Pixel> listPosStart;
//     listPosStart.push_back(pStart0);
//     listPosStart.push_back(pStart1);
//     listPosStart.push_back(pStart2);
//     listPosStart.push_back(pStart3);

//     Pixel pEnd0 = Pixel(9,17,color5);
//     Pixel pEnd1 = Pixel(9,17,color6);
//     Pixel pEnd2 = Pixel(9,17,color7);
//     Pixel pEnd3 = Pixel(9,17,color8);
//     vector<Pixel> listPosEnd;
//     listPosEnd.push_back(pEnd0);
//     listPosEnd.push_back(pEnd1);
//     listPosEnd.push_back(pEnd2);
//     listPosEnd.push_back(pEnd3);

//     int solution_user = doExercice(listPatternInit, listPosStart, listPosEnd,opencv.sizeImage);

//     return exercice.assertRes(solution_user, resultat);
// }

// int main(int argc, char *argv[]){
//     string nameExercice = "comparaisonSegment";
//     int resultat = 0;
//     int nbMatriceResult = 0;

//     cout << testAlgo(nameExercice, resultat, nbMatriceResult) << endl;
// }
//   `,
//   functionTemplate: `
// int doExercice(vector<Matrice>listPattern, vector<Pixel> listPosStart ,vector<Pixel> listPosEnd ,int size_matrice){
//   //implement me
// }
//     `,
// },

// exebootstrapPython : {
//   language: 'python',

//   tests: `
// import cv2 as cv
// import matplotlib
// import numpy

// from lib.bib import Matrice, Pixel, Opencv, Exercice

// // USER_CODE

// def testAlgo(nameExercice, resultat, nbMatriceResult):
//   opencv = Opencv(nameExercice)
//   opencv.setNumberImageResultat(nbMatriceResult)
//   opencv.getNumberImage()
//   opencv.extractImage()
//   opencv.initSizeImage()

//   exercice = Exercice(resultat, nameExercice)
//   listPatternInit = opencv.initExercice(opencv.sizeImage)

//   listPosStart = [(13, 4), (13, 4), (13, 4), (16, 7)]
//   listPosEnd = [(9, 17), (9, 17), (9, 17), (9, 17)]

//   solution_user = doExercice(listPatternInit, listPosStart ,listPosEnd ,opencv.sizeImage)
//   return exercice.assertRes(solution_user, resultat)

// if __name__ == '__main__':
//     nameExercice = "comparaisonSegment"
//     resultat = 0
//     nbMatriceResult = 0
//     print(testAlgo(nameExercice, resultat, nbMatriceResult))
//   `,
//   functionTemplate: `
//   def doExercice(listPattern, listPosStart ,listPosEnd ,size_matrice):
//     #implement me
//     `,
// }
//     },

//     {
//       name: 'compteSegment',

//       instructions:"Consigne: Vous disposez d'une liste d'image."+
//       "Implémentez la fonction doExercice afin de créer un algoritme capable de compter le nombre de segment par image"+

//       "Donnée: Liste d'images a traiter => listMatrice"+

//       "Réponse: vous devez retourner un tableau contenant le nombre de segment pour chaque image. L'id de la case correspondra au numero de la figure"

//       ,

// exebootstrapCpp : {
//   language: 'cpp',

//   tests: `
//   #include <stdio.h>
//   #include <opencv2/highgui.hpp>
//   #include <string>
//   #include <iostream>
//   #include "./lib/Opencv.h"
//   #include "./lib/Exercice.h"
//   #include "./lib/Matrice.h"
//   #include "./lib/Line.h"
//   #include "./lib/Pixel.h"
//   using namespace std;

//   // USER_CODE

//   string testAlgo(string nameExercice,  vector<int> resultat, int nbMatriceResult){
//     Opencv opencv = Opencv(nameExercice);
//     opencv.setNumberImageResultat(nbMatriceResult);
//     opencv.getNumberImage();
//     opencv.extractImage();
//     opencv.initSizeImage();

//     Exercice exercice = Exercice(0, nameExercice);
//     vector<Matrice> listPatternInit = opencv.initExercice();

//     vector<int> solution_user = doExercice(listPatternInit, opencv.sizeImage);

//     cout << "solution_user" << endl;
//     cout << solution_user[0] << endl;
//     cout << solution_user[1] << endl;
//     cout << solution_user[2] << endl;

//     return exercice.assertResMultInt(solution_user, resultat);
// }

// int main(int argc, char *argv[]){
//     string nameExercice = "compteSegment";

//     vector<int> resultat;
//     resultat.push_back(0);
//     resultat.push_back(3);
//     resultat.push_back(6);

//     int nbMatriceResult = 0;

//     cout << testAlgo(nameExercice, resultat, nbMatriceResult) << endl;
// }

//   `,
//   functionTemplate: `
// vector<int> doExercice(vector<Matrice> listPattern,int size_matrice){
//       //implement me

//     }
//     `,
// },

// exebootstrapPython : {
//   language: 'python',

//   tests: `
// import cv2 as cv
// import numpy

// from lib.bib import Matrice, Pixel, Exercice, Opencv

// // USER_CODE

// def testAlgo(nameExercice, resultat, nbMatriceResult):
//     opencv = Opencv(nameExercice)
//     opencv.setNumberImageResultat(nbMatriceResult)
//     opencv.getNumberImage()
//     opencv.extractImage()
//     opencv.initSizeImage()
//     exercice = Exercice(resultat, nameExercice)
//     listPatternInit = opencv.initExercice(opencv.sizeImage)
//     solution_user = [0, 0, 0]
//     solution_user = doExercice(listPatternInit, opencv.sizeImage, solution_user)
//     return exercice.assertRes(solution_user, resultat)

// if __name__ == '__main__':
//     nameExercice = "compteSegment"
//     resultat = [0, 3, 6]
//     nbMatriceResult = 0
//     print(testAlgo(nameExercice, resultat, nbMatriceResult))

//   `,
//   functionTemplate: `
// def doExercice(listPattern, size_matrice, resultat_utilisateur):
//   #implement me
//     `,
// }
//     },

//     {
//       name: 'dataForm',

//       instructions: "Consigne: Vous disposez d'une image contenant plusieurs formes."+
//       "Implémentez la fonction doExercice afin de créer un algoritme capable de déterminer si une forme est un :"+
//       "carré"+
//       "rectangle"+
//       "autre parallèlogramme"+
//       "triangle rectangle"+
//       "triangle équilatéral"+
//       "triangle isocèle"+
//       "triangle quelconque"+
//       "polygone à 5 coté"+
//       "polygone à 6 coté"+
//       "polygone à 7 coté"+
//       "Donnée: l'image contenant les fromes, la taille de l'image et un dictionnaire python à remplire à renvoyer"+
//       "Réponse: vous devez retourner le dictionnaire contenant le nom des formes en clé et leur nombre en valeur"
// ,

// exebootstrapCpp : {
//   language: 'cpp',

//   tests: `
//   #include <stdio.h>
//   #include <opencv2/highgui.hpp>
//   #include <string>
//   #include <iostream>
//   #include "./bibliothequeCpp/Opencv.h"
//   #include "./bibliothequeCpp/Exercice.h"
//   #include "./bibliothequeCpp/Matrice.h"
//   #include "./bibliothequeCpp/Line.h"
//   #include "./bibliothequeCpp/Pixel.h"
//   #include <map>
//   using namespace std;

//   // USER_CODE

//   std::string testAlgo(std::string nameExercice, std::map<string, int> resultat, int nbMatriceResult){
//     Opencv opencv = Opencv(nameExercice);
//     opencv.setNumberImageResultat(nbMatriceResult);
//     opencv.getNumberImage();
//     opencv.extractImage();
//     opencv.initSizeImage();

//     Exercice exercice = Exercice(-1, nameExercice);
//     vector<Matrice> listPatternInit = opencv.initExercice();

//     int size = opencv.getSizeImage();

//         std::map<string, int> tab_user = {{"carré", 0,},
//                                     {"rectangle", 0,},
//                                     {"autre parallèlogramme", 0,},

//                                     {"triangle rectangle", 0,},
//                                     {"triangle équilatéral", 0,},
//                                     {"triangle isocèle", 0,},
//                                     {"triangle quelconque", 0,},

//                                     {"polygone à 5 coté", 0,},
//                                     {"polygone à 6 coté", 0,},
//                                     {"polygone à 7 coté", 0,}};

//     std::map<string, int> solution_user = doExercice(listPatternInit, tab_user, size);

//     return exercice.assertResMultDict(solution_user, resultat);
// }

//    int main(int argc, char *argv[]){

//     std::string nameExercice = "dataForm";

//     std::map<string, int> resultat = {{"carré", 2,},
//                                     {"rectangle", 3,},
//                                     {"autre parallèlogramme", 1,},

//                                     {"triangle rectangle", 2,},
//                                     {"triangle équilatéral", 0,},
//                                     {"triangle isocèle", 2,},
//                                     {"triangle quelconque", 1,},

//                                     {"polygone à 5 coté", 1,},
//                                     {"polygone à 6 coté", 0,},
//                                     {"polygone à 7 coté", 2,}};

//     int nbMatriceResult = 0;
//     cout << testAlgo(nameExercice, resultat, nbMatriceResult) << endl;

// }
//   `,
//   functionTemplate: `
//   std::map<string, int> doExercice(vector<Matrice> listPattern, std::map<string, int> dict_resultat, int size){

//     }
//     `,
// },

// exebootstrapPython : {
//   language: 'python',

//   tests: `
// import cv2 as cv
// import numpy
// import math

// from lib.bib import Matrice, Pixel, Opencv, Exercice

// // USER_CODE

// def testAlgo(nameExercice, resultat, nbMatriceResult):
//   opencv = Opencv(nameExercice)
//   opencv.setNumberImageResultat(nbMatriceResult)
//   opencv.getNumberImage()
//   opencv.extractImage()
//   opencv.initSizeImage()

//   exercice = Exercice(resultat, nameExercice)
//   listPatternInit = opencv.initExercice(opencv.sizeImage)

//   solutionUser = {
//           "carré": 0,
//           "rectangle": 0,
//           "autre parallèlogramme": 0,

//           "triangle rectangle": 0,
//           "triangle équilatéral": 0,
//           "triangle isocèle": 0,
//           "triangle quelconque": 0,

//           "polygone à 5 coté": 0,
//           "polygone à 6 coté": 0,
//           "polygone à 7 coté": 0,
//   }

//   solution_user = doExercice(listPatternInit, solutionUser, opencv.sizeImage)
//   return exercice.assertRes(solution_user, resultat)

// if __name__ == '__main__':
//     nameExercice = "dataForm"

//     resultat = {
//           "carré": 2,
//           "rectangle": 3,
//           "autre parallèlogramme": 1,

//           "triangle rectangle": 2,
//           "triangle équilatéral": 0,
//           "triangle isocèle": 2,
//           "triangle quelconque": 1,

//           "polygone à 5 coté": 1,
//           "polygone à 6 coté": 0,
//           "polygone à 7 coté": 2,
//     }
//     nbMatriceResult = 0
//     print(testAlgo(nameExercice, resultat, nbMatriceResult))
//   `,
//   functionTemplate: `
//   def doExercice(listPattern,solutionUser, size_picture):
//     #implement me
//     `,
// }
//     },

//     {
//       name: 'comparaisonKosh',

//       instructions: "Consigne:"+
//       "Implémentez la fonction doExercice afin de créer un algoritme capable de trouver la valeur d'une fonctionde kosh"+
//       "le résultat sera à donner sous forme de tableau",

// exebootstrapCpp : {
//   language: 'cpp',

//   tests: `
//   #include <stdio.h>
//   #include <opencv2/highgui.hpp>
//   #include <string>
//   #include <iostream>
//   #include "./bibliothequeCpp/Opencv.h"
//   #include "./bibliothequeCpp/Exercice.h"
//   #include "./bibliothequeCpp/Matrice.h"
//   #include "./bibliothequeCpp/Line.h"
//   #include "./bibliothequeCpp/Pixel.h"

//   using namespace std;

//   // USER_CODE

//   std::string testAlgo(std::string nameExercice, vector<int>  resultat, int nbMatriceResult){
//     Opencv opencv = Opencv(nameExercice);
//     opencv.setNumberImageResultat(nbMatriceResult);
//     opencv.getNumberImage();
//     opencv.extractImage();
//     opencv.initSizeImage();

//     Exercice exercice = Exercice(-1, nameExercice);
//     std::vector<Matrice> listPatternInit = opencv.initExercice();

//     int pixelStartX = 0;
//     int pixelStartY = 51;
//     int size = opencv.getSizeImage();

//     vector<int> solution_user = doExercice(listPatternInit, pixelStartX, pixelStartY, size);

//     return exercice.assertResMultInt(solution_user, resultat);
// }

// int main(int argc, char *argv[])
// {
//     std::string nameExercice = "comparaisonKosh";
//     std::vector<int> resultat = {1,2,0};

//     int nbMatriceResult = 0;
//     cout << testAlgo(nameExercice, resultat, nbMatriceResult) << endl;

// }
//   `,
//   functionTemplate: `
//   vector<int> doExercice(vector<Matrice> listPattern, int start_X, int start_Y, int size)
//       //implement me
//     }
//     `,
// },

// exebootstrapPython : {
//   language: 'python',

//   tests: `

// import cv2 as cv
// from lib.bib import Matrice, Opencv, Exercice, Pixel

// // USER_CODE

// def testAlgo(nameExercice, resultat):
//     opencv = Opencv(nameExercice)
//     opencv.getNumberImage()
//     opencv.extractImage()
//     opencv.initSizeImage()
//     exercice = Exercice(resultat, nameExercice)
//     listPatternInit = opencv.initExercice(opencv.sizeImage)
//     pixelStartX = 0
//     pixelStartY = 51

//     size = opencv.sizeImage

//     solution_user = doExercice(listPatternInit, pixelStartX, pixelStartY, size)
//     return exercice.assertRes(solution_user, resultat)

// if __name__ == '__main__':
//     nameExercice = "comparaisonKosh"
//     resultat = [1,2,0]

//     print(testAlgo(nameExercice, resultat))

//   `,
//   functionTemplate: `
// def doExercice(listMatrice, pixelStartX, pixelStartY, size):
//   #implement me
//     `,
// }
//     },
//   ];

//   @Command({
//     command: 'seed:courses',
//     describe: 'Fill courses with default challenges in database',
//     autoExit: true,
//   })
//   async create() {
//     await Promise.all(
//       this.challenges.map((c) => {
//         const deleteChallenge = async (): Promise<void> => {
//           const existing = await this.challengeService.findByName(c.name);

//           if (existing) {
//             await this.challengeService.delete({ id: existing._id });
//           }
//         };

//         return deleteChallenge();
//       }),
//     );

//     const existingSerie = await this.seriesService.findByName(this.serie.name);

//     if (existingSerie) {
//       await this.seriesService.delete(existingSerie._id);
//     }

//     const existingUser = await this.userService.findByUsername(
//       this.user.username,
//     );

//     if (existingUser) {
//       await this.userService.delete(existingUser._id);
//     }

//     const createdUser = await this.userService.create({
//       ...this.user,
//     });

//     const serie = await this.seriesService.create({
//       name: this.serie.name,
//       owner: createdUser._id.toString(),
//       isCourse: true,
//     });

//     const challenges = await Promise.all(
//       this.challenges.map((c) => {
//         return this.challengeService.create(
//           {
//             instructions: c.instructions,
//             name: c.name,
//             owner: createdUser._id.toString(),
//             isCourse: true,
//           },
//           [],
//         );
//       }),
//     );

//     await Promise.all(
//       challenges.map((c) => {
//         return this.execBootstrapService.create({
//           ...this.exebootstrap,
//           challenge: c._id.toString(),
//         });
//       }),
//     );

//     await this.seriesService.update(serie._id, {
//       challenges: challenges.map((c) => c._id),
//     });
//   }
// }
