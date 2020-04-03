import c4d, math
from c4d import utils


def generate(master, init):
	
	obj = master.GetClone()

	couunter = init

	angle = counter * 2.39996322972865332
	sin, cos  = c4d.utils.SinCos(angle)

	obj.SetRelPos(c4d.Vector(30*angle*sin, 30*angle*cos, 0.0))
	obj.SetRelRot(c4d.Vector(0,0,angle))

	doc.InsertObject(obj)

	counter += counter + 1

	if counter < 200:

		generate(obj, counter)

	return


def main():
	
	parent = op

	counter = 1

	generate(parent, counter)

	return


if __name__=='__main__':
	main()