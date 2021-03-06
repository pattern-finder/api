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


    const execResultsAlgoEvaluation = await this.execServerService.executeAlgoEvaluation(
      insertAttemptDTO.code,
      execBootstrap,
    );


    const evaluation = execResultsAlgoEvaluation['stdout']
    const string = JSON.stringify(evaluation)
    const list_content_start = string.split('[');
    const list_content_stop = list_content_start[1].split(']');
    const list_content = list_content_stop[0];
    const elt = list_content.split(",")



    const challenge = await this.challengesService.findOne({
      id: execBootstrap.challenge,
    });


    let plagiaStringSize = 0
    let stringSize = 0


    let n = 0;
    while(n<elt.length){
      let element = elt[n]
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
        }else{
          execResults["stdout"]=execResults["stdout"]+execResultsAlgoEvaluation["stdout"]
        }
 

        console.log("aaaa")
      console.log((plagiaStringSize*100)/(stringSize))
      console.log("aaaa")

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
