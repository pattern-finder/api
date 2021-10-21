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

    const spawn = require("child_process").spawn;
    console.log(execBootstrap.language);
    const pythonProcess = spawn('python3',[`${ALGO_DIR}/${execBootstrap.language}/main.py`, insertAttemptDTO.code]);
    var resulte_algo_eval_code;
    await pythonProcess.stdout.on('data', (data) => {
      console.log(data.toString())
      resulte_algo_eval_code = data.toString()
    });


    const pythonProcess2 = spawn('python3',[`${ALGO_DIR}/${execBootstrap.language}/mainToken.py`, insertAttemptDTO.code]);
    var tokenCode:string = "";
    var list_content;

    await pythonProcess2.stdout.on('data', (data) => {

      tokenCode = data.toString()
      console.log(data.toString())
      list_content = tokenCode.split(';;;');
    });

    const challenge = await this.challengesService.findOne({
      id: execBootstrap.challenge,
    });

    const plagiatCodeDto : CreateCatDto = {
      nameExo: challenge.name,
      userId: insertAttemptDTO.user
    }; 


    var stringPatter;
    list_content.forEach(async user_pattern => {
      stringPatter = stringPatter + ";;;" + user_pattern;
    });


    const listUserCode = await this.evalPlagiatService.find(plagiatCodeDto);

    listUserCode.forEach(user => {



        const pythonProcess3 = spawn('python3',[`${ALGO_DIR}/python/mainPlagiat.py`, user.tokenCode, stringPatter]);
        console.log(user.tokenCode)


        pythonProcess3.stdout.on('data', (data) => {
          console.log("start res")
          console.log(pythonProcess3)
          console.log(data.toString())
          console.log("end res")

        });



    }
    );

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

    execResults["stdout"] = resulte_algo_eval_code
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



  async findOne(findAttemptDTO: FindByIdDTO): Promise<Attempt> {
    const attempt: Attempt = (
      await this.attemptModel.findById(findAttemptDTO.id).exec()
    )?.toObject();

    if (!attempt) {
      throw new NotFoundException('This attempt does not exist.');
    }

    return attempt;
  }

  async findAll(): Promise<Attempt[]> {
    return (await this.attemptModel.find().exec()).map((attempt) =>
      attempt.toObject(),
    );
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
    const bootstraps = await (
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
