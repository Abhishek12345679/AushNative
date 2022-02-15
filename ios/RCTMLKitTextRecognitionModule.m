//
//  RCTMLKitTextRecognitionModule.m
//  HelloWorld
//
//  Created by Abhishek Sah on 15/02/22.
//

#import <Foundation/Foundation.h>
#import "RCTMLKitTextRecognitionModule.h"
#import <React/RCTLog.h>

@import MLKit;

@implementation RCTMLKitTextRecognitionModule

// To export a module named RCTCalendarModule
RCT_EXPORT_MODULE(MLKitTextRecognitionModule);


- (NSMutableDictionary *)getFrameDictionary:(CGRect)frame {
  NSMutableDictionary *rect = [NSMutableDictionary dictionary];
  
  [rect setValue:[NSNumber numberWithFloat:frame.origin.x] forKey:@"left"];
  [rect setValue:[NSNumber numberWithFloat:frame.origin.y] forKey:@"top"];
  [rect setValue:[NSNumber numberWithFloat:frame.size.width] forKey:@"width"];
  [rect setValue:[NSNumber numberWithFloat:frame.size.height] forKey:@"height"];
  
  return rect;
}


RCT_EXPORT_METHOD(extractWords:(NSString *)url
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  NSURL *_url = [NSURL URLWithString:url];
  NSData *imageData = [NSData dataWithContentsOfURL:_url];
  UIImage *image = [UIImage imageWithData:imageData];
  
  MLKVisionImage *visionImage = [[MLKVisionImage alloc] initWithImage:image];
  
  MLKTextRecognizer *textRecognizer = [MLKTextRecognizer textRecognizer];
  
  [textRecognizer processImage:visionImage
                    completion:^(MLKText *_Nullable result,
                                 NSError *_Nullable error) {
    if (error != nil || result == nil) {
      // Error handling
      reject(@"text_recognition", @"Text recognition has failed", nil);
      return;
    }
    
    NSMutableDictionary *response = [NSMutableDictionary dictionary];
    
    [response setValue:[NSNumber numberWithInt:image.size.width] forKey:@"width"];
    [response setValue:[NSNumber numberWithInt:image.size.height] forKey:@"height"];
    
    NSMutableArray *blocks = [NSMutableArray array];
    
    for (MLKTextBlock *block in result.blocks) {
      
      NSMutableDictionary *blockDict = [NSMutableDictionary dictionary];
      [blockDict setValue:block.text forKey:@"text"];
      [blockDict setValue:[self getFrameDictionary:block.frame] forKey:@"rect"];
      
      NSMutableArray *lines = [NSMutableArray array];
      for (MLKTextLine *line in block.lines) {
        
        NSMutableDictionary *lineDict = [NSMutableDictionary dictionary];
        [lineDict setValue:line.text forKey:@"text"];
        [lineDict setValue:[self getFrameDictionary:line.frame] forKey:@"rect"];
        
        NSMutableArray *words = [NSMutableArray array];
        for (MLKTextElement *word in line.elements) {
          
          NSMutableDictionary *wordDict = [NSMutableDictionary dictionary];
          [wordDict setValue:word.text forKey:@"text"];
          [wordDict setValue:[self getFrameDictionary:word.frame] forKey:@"rect"];
          
          [words addObject:wordDict];
        }
        [lineDict setValue:words forKey:@"words"];
        [lines addObject:lineDict];
      }
      [blockDict setValue:lines forKey:@"lines"];
      [blocks addObject:blockDict];
    }
    
    [response setValue:blocks forKey:@"blocks"];
    resolve(response);
  }];

         
}

@end
