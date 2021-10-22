import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChallengesService } from 'src/challenges/challenges.service';
import { EvalPlagiatService } from 'src/evalPlagiat/evalPlagiat.service';
import { FindByIdDTO } from 'src/common/dto/find-by-id.dto';
import { ExecBootstrapsService } from 'src/exec-bootstrap/exec-bootstraps.service';
import { GodBoxRepository } from 'src/exec-server/godbox.repository';
import { Attempt, AttemptDocument } from './attempt.schema';
import { ExecutionResultsDTO } from './dto/execution-results.dto';
import { FindByUserAndBootstrapDTO } from './dto/find-by-user-and-bootstrap.dto';
import { InsertAttemptDTO } from './dto/insert-attempt.dto';
import { CreateCatDto } from 'src/evalPlagiat/dto/create-evalPlagiat.dto';
import { VerifCatDto } from 'src/evalPlagiat/dto/verif-evalPlagiat.dto';

const ALGO_DIR = process.env.ALGO_DIR || '/usr/src/app/evaluation_code';

@Injectable()
export class AttemptsService {
  constructor(
    @InjectModel(Attempt.name)
    private readonly attemptModel: Model<AttemptDocument>,
    private readonly execServerService: GodBoxRepository,
    private readonly execBootstrapService: ExecBootstrapsService,
    private readonly challengesService: ChallengesService,
    private readonly evalPlagiatService: EvalPlagiatService,

  ) {}

  async create(
    insertAttemptDTO: InsertAttemptDTO, // link challenge and execbootstrap
  ): Promise<ExecutionResultsDTO> {
    const execBootstrap = await this.execBootstrapService.findOne({
      id: insertAttemptDTO.execBootstrap,
    });

    if (!execBootstrap) {
      throw new NotFoundException(
        'This language is not available for this challenge.',
      );
    }

    const execResults = await this.execServerService.execute(
      insertAttemptDTO.code,
      execBootstrap,
    );

    const exec = require("child_process").execSync;
    var resulte_algo_eval_code = await this.evalCode(execBootstrap.language, insertAttemptDTO.code)



    var tokenCode = await this.getTokenCode(execBootstrap.language, insertAttemptDTO.code)
    tokenCode = tokenCode.replace('\n', '');  

    const challenge = await this.challengesService.findOne({
      id: execBootstrap.challenge,
    });

    const plagiatCodeDto : CreateCatDto = {
      nameExo: challenge.name,
      userId: insertAttemptDTO.user,
      token:codeToSave
    }; 
    
    const listUserCode = await this.evalPlagiatService.find(plagiatCodeDto);
    console.log("len listUserCode"+ listUserCode.length)
    console.log(tokenCode)

    var code ='';
    console.log("user.tokenCode")

    listUserCode.forEach(user => {
      console.log(user.tokenCode)
      if(user.tokenCode != undefined){
        if (code != ''){
          code = code.concat('|separator|', user.tokenCode)

        }else{
          code = user.tokenCode
        }
      }
    });
    code = code.replace('\'', '');  

    console.log("code")
    console.log(code)

    var retour = await this.evalPlagiat(code, tokenCode)
    var index = retour.indexOf("True");
    console.log(index)
    if (index == -1){

        var codeToSave = await this.getTokenCodeToSave(execBootstrap.language, insertAttemptDTO.code)

        console.log("codeToSave")
        console.log(codeToSave)

        const plagiatCodeDto : CreateCatDto = {
          nameExo: challenge.name,
          userId: insertAttemptDTO.user,
          token:codeToSave
        }; 
    
        const verifCatDto : VerifCatDto = {
          token: codeToSave,
          userId: insertAttemptDTO.user
        }; 

        const affList = await this.evalPlagiatService.findByToken(verifCatDto);

        if(affList.length == 0){
          const res = await this.evalPlagiatService.create(plagiatCodeDto);
          console.log("code save!")

        }else{
          console.log("code use previously")
        }

    }else{
      resulte_algo_eval_code = "Plagiat"
    }
/*
    let plagiaStringSize = 0
    let stringSize = 0


    let n = 0;
    while(n<list_content.length){





      let element = list_content[n]
        const plagiatCodeDto : CreateCatDto = {
          tokenCode: element,
          nameExo: challenge.name,
          userId: insertAttemptDTO.user
        }; 

        const affList = await this.evalPlagiatService.find(plagiatCodeDto);

        stringSize = stringSize + element.length

        if(affList.length > 0){
          plagiaStringSize = plagiaStringSize + element.length
        }else{
          const res = await this.evalPlagiatService.create(plagiatCodeDto);
    
        }
        n = n+1;
      }


        if ((plagiaStringSize*100)/(stringSize) >= 80){
          execResults["stdout"] = "PALGIAT"
        }
 

      console.log((plagiaStringSize*100)/(stringSize))
      */
    console.log("retour")
    console.log(JSON.stringify(retour))

    execResults["stdout"] = resulte_algo_eval_code
    console.log(resulte_algo_eval_code)
    console.log("PROG END")
    const attempt = (
      await new this.attemptModel({
        ...execResults,
        ...insertAttemptDTO,
        phase: execResults.name,
        createdAt: new Date(),
      }).save()
    ).toObject();

    return { ...execResults, id: attempt.id };
  }


  async findAll(): Promise<Attempt[]> {
    return (await this.attemptModel.find().exec()).map((attempt) =>
      attempt.toObject(),
    );
  }

  async findOne(findAttemptDTO: FindByIdDTO): Promise<Attempt> {
    const attempt: Attempt = (
      await this.attemptModel.findById(findAttemptDTO.id).exec()
    )?.toObject();

    if (!attempt) {
      throw new NotFoundException('This attempt does not exist.');
    }

    return attempt;
  }

  async evalPlagiat(code: string, stringPattern: string): Promise<string> {

    const exec = require("child_process").execSync;

    var result = exec("python3 "+ALGO_DIR+"/python/mainPlagiat.py \'"+code+"\' \'"+stringPattern+"\'");
    return result.toString()

  }



  async getTokenCode(language: string, code: string): Promise<string> {
    const exec = require("child_process").execSync;
    var resulte_algo_eval_code;
    var result = exec("python3 "+ALGO_DIR+"/"+language+"/mainToken.py \'"+code+"\'");
    resulte_algo_eval_code = result.toString()
    return resulte_algo_eval_code

  }

  async getTokenCodeToSave(language: string, code: string): Promise<string> {
    const exec = require("child_process").execSync;
    var resulte_algo_eval_code;
    var result = exec("python3 "+ALGO_DIR+"/"+language+"/mainTokenToSave.py \'"+code+"\'");
    resulte_algo_eval_code = result.toString()
    return resulte_algo_eval_code

  }


  async evalCode(language: string, code: string): Promise<string> {
    const exec = require("child_process").execSync;
    var resulte_algo_eval_code;
    var result = exec("python3 "+ALGO_DIR+"/"+language+"/main.py \'"+code+"\'");
    resulte_algo_eval_code = result.toString()
    return resulte_algo_eval_code
  }




  async findByUserAndBootstrap(findAttemptDTO: FindByUserAndBootstrapDTO) {
    return (
      await this.attemptModel
        .find({
          execBootstrap: findAttemptDTO.execBootstrap,
          user: findAttemptDTO.user,
        })
        .sort({ createdAt: 'desc' })
        .exec()
    ).map((attempt) => attempt.toObject());
  }

  async findByUser(userIdObject: FindByIdDTO): Promise<Attempt[]> {
    const attempts = (
      await this.attemptModel.find({ user: userIdObject.id }).exec()
    ).map((c) => c.toObject());
    return attempts;
  }

  async findValidatedByUserAndChallenge(
    userId: string,
    challengeId: string,
  ): Promise<Attempt[]> {
    const bootstraps = (
      await this.challengesService.findOne({ id: challengeId })
    ).execBootstraps;
    const attempts = (
      await this.attemptModel
        .find({
          $and: [
            {
              $or: bootstraps.map((b) => {
                return { execBootstrap: b._id.toString() };
              }),
            },
            { user: userId },
            { status: 0 },
            { phase: 'Execution' },
          ],
        })
        .exec()
    ).map((a) => a.toObject());
    return attempts;
  }
}
