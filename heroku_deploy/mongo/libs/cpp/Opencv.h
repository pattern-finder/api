
#ifndef OPENCV_H // include guard
#define OPENCV_H

#include "Matrice.h"
#include "Pixel.h"

class Opencv
{

public:
    int numberImage = 0;
    int nbMatriceResult = 0;
    int sizeImage = 0;
    std::string nameExercice;
    std::vector<cv::Mat> listPatternInit;

    Opencv(std::string nameExercice);

    void setNumberImageResultat(int nbMatriceResult);

    void initSizeImage();

    void getNumberImage();

    void extractImage();

    int getSizeImage();

    Matrice matriceResult();

    std::vector<Matrice> initExercice();
};

#endif /* MY_CLASS_H */