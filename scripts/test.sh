#!/bin/bash

cols=""
i=80

# Append 'x' to cols variable i times
for ((j=0;j<$i;j++)); do
    cols+="x"
done

cd ..

for i in {1..2}
do
    rm -R test
    mkdir test

    cd test
    npx nuxi init nuxt-app
    cd nuxt-app
    echo $cols
    npm i

    cd ../..
done


cols=""
i=80

# Append 'x' to cols variable i times
for ((j=0;j<$i;j++)); do
    cols+="x"
done

cd ..

for i in {1..2}
do
    rm -R test
    mkdir test

    cd test
    npx nuxi init nuxt-app
    cd nuxt-app
    echo $cols
    npm i

    cd ../..
done

cols=""
i=80

# Append 'x' to cols variable i times
for ((j=0;j<$i;j++)); do
    cols+="x"
done

cd ..

for i in {1..2}
do
    rm -R test
    mkdir test

    cd test
    npx nuxi init nuxt-app
    cd nuxt-app
    echo $cols
    npm i

    cd ../..
done
