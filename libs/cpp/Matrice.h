

#ifndef DEF_MATRICE // include guard
#define DEF_MATRICE

#include "Pixel.h"
#include "Line.h"

class Matrice
{

public:
    int size;

    std::vector<Line> matriceContent;

    Matrice(int size);

    int getSize();

    Pixel getPixel(int x, int y);

    std::vector<Line> getMatriceContent();

    void toStringPixel();

    void toStringColor();

    void initContent(cv::Mat img);
};

#endif /* MY_CLASS_H */