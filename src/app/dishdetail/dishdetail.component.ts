import { Component, OnInit, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import 'rxjs/add/operator/switchMap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})

export class DishdetailComponent implements OnInit {

dish: Dish;
dishIds: number[];
prev: number;
next: number;
errMess: string;
commentForm: FormGroup;
comment: Comment;
formErrors = {
  'author': '',
  'comment':''
};

validationMessages = {
  'author': {
    'required': 'Name is required.',
    'minlength': 'Name must be at least two characters long.'
  },
  'comment': {
    'required': 'Comment is required.'
  }
};


  constructor(private dishService: DishService,
              private route: ActivatedRoute,
              private location: Location,
              private fb: FormBuilder,
              @Inject('BaseURL') private BaseURL){
                 this.createForm();
               }



  ngOnInit() {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params
      .switchMap((params: Params) => this.dishService.getDish(+params['id']))
      .subscribe(dish => { this.dish = dish;
                           this.setPrevNext(dish.id);}
                         errMess => this.errMess = <any>errmess);
  }

  setPrevNext(dishId: number) {
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
  }


   goBack(): void {
     this.location.back();
   }

   createForm(){
     this.commentForm = this.fb.group({
       author:['', [Validators.required, Validators.minLength(2)] ],
       rating:'',
       comment:['',Validators.required],
     });

     this.commentForm.valueChanges
       .subscribe(data => this.onValueChanged(data));

     this.onValueChanged(); // (re)set form validation messages
   }

   onValueChanged(data?: any) {
     if(!this.commentForm)
     {
       return;
     }

     const form = this.commentForm;
     for(const field in this.formErrors)
     {
       this.formErrors[field] = '';
       const control = form.get(field);
       if (control && control.dirty && !control.valid)
       {
         const messages = this.validationMessages[field];
         for(const key in control.errors)
         {
           this.formErrors[field] += messages[key] + ' ';
         }
       }
     }
  }

   onSubmit(){
     var d = new Date();
     this.comment = this.commentForm.value;
     this.comment.date = d.toISOString();
     this.dish.comments.push(this.comment);
     console.log(this.comment);
     this.commentForm.reset({
       author:'',
       rating:'',
       comment:''
     });
   }

}
