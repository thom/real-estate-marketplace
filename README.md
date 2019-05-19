# Capstone: Real Estate Marketplace

The capstone will build upon the knowledge gained in the course in order to build a decentralized housing product. 

## ZoKrates

### Step 1: Run Docker

```
sudo systemctl start docker

# In case SELinux prevents access to the local drive
sudo su -c "setenforce 0"
```

### Step 2: Run ZoKrates
```
docker run -v `pwd`/zokrates/code/:/home/zokrates/code -ti zokrates/zokrates /bin/bash
```

Change into the square directory
``` 
cd code/square/
``` 

### Step 3: Compile the program written in ZoKrates DSL
``` 
~/zokrates compile -i square.code
``` 

### Step 4: Generate the trusted setup
``` 
~/zokrates setup
```

### Step 5: Compute witness
``` 
~/zokrates compute-witness -a 3 9
```

### Step 6: Generate proof
```
~/zokrates generate-proof
```

### Step 7: Export verifier
```  
~/zokrates export-verifier
```

## Requirements

Graded according to the [Project Rubric](https://review.udacity.com/#!/rubrics/1712/view).

## Project Resources

* [Remix - Solidity IDE](https://remix.ethereum.org/)
* [Visual Studio Code](https://code.visualstudio.com/)
* [Truffle Framework](https://truffleframework.com/)
* [Ganache - One Click Blockchain](https://truffleframework.com/ganache)
* [Open Zeppelin ](https://openzeppelin.org/)
* [Interactive zero knowledge 3-colorability demonstration](http://web.mit.edu/~ezyang/Public/graph/svg.html)
* [Docker](https://docs.docker.com/install/)
* [ZoKrates](https://github.com/Zokrates/ZoKrates)