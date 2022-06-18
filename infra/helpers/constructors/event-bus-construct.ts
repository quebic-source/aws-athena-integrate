import * as aws from "@pulumi/aws";
import {getResourceName} from "../utils/common-utils";
import {EventRuleAssigneeArgs, EventRuleCreateArgs} from "../../types/aws-resources";

export class EventBusConstructor {
    private readonly _eventBus: aws.cloudwatch.EventBus;

    constructor(name: string) {
        this. _eventBus = new aws.cloudwatch.EventBus(getResourceName(name), {});
    }

    public get eventBus(): aws.cloudwatch.EventBus{
        return this._eventBus;
    }
}

export class EventRuleConstructor {
    private readonly _eventRule: aws.cloudwatch.EventRule;
    constructor(args: EventRuleCreateArgs) {
        this._eventRule = new aws.cloudwatch.EventRule(getResourceName(args.name), {
            description: args.description,
            eventPattern: args.eventPattern,
            scheduleExpression: args.scheduleExpression,
            eventBusName: args.eventBusName,
            roleArn: args.roleArn,
            isEnabled: args.isEnabled
        });
        args.targets.forEach(target=> {
            new aws.cloudwatch.EventTarget(target.targetId, {
                eventBusName: args.eventBusName,
                rule: this._eventRule.name,
                arn: target.targetFunction.arn
            });
        })
    }

    public get eventRule(): aws.cloudwatch.EventRule {
        return this._eventRule;
    }
}

export class EventRuleAssigneeConstructor {
    private readonly _eventRule: aws.cloudwatch.EventRule;
    constructor(args: EventRuleAssigneeArgs) {
        this._eventRule = aws.cloudwatch.EventRule.get(args.name, args.name);
        args.targets.forEach(target=> {
            new aws.cloudwatch.EventTarget(target.targetId, {
                eventBusName: args.eventBusName,
                rule: this._eventRule.name,
                arn: target.targetFunction.arn
            });
        })
    }

    public get eventRule(): aws.cloudwatch.EventRule {
        return this._eventRule;
    }
}