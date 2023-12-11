#/bin/bash --login

#$ -M charlton@vsp.tu-berlin.de
#$ -N simrunner-test1
#$ -o simrunner.log
#$ -j -y
#$ -m abe
#$ -pe mp 2
#$ -l mem_free=1G
#$ -cwd

echo "THiS ScriPT rAN!#!" > output.txt





