
#ifndef DEF_PIXEL // include guard
#define DEF_PIXEL

class Pixel
{

public:
  Pixel(int x, int y, int *color);

  int x;
  int y;
  int color[3] = {0, 0, 0};

  int getX();

  int getY();

  int *getColor();

  int getColorRed();

  int getColorGreen();

  int getColorBlue();

  bool compare(Pixel pixel2);
};

#endif /* MY_CLASS_H */