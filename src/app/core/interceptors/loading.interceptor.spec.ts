import { HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { LoadingService } from '@core/services/loading.service';
import { of, throwError } from 'rxjs';
import { loadingInterceptor } from './loading.interceptor';

describe('loadingInterceptor', () => {
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let mockNext: jasmine.Spy;

  beforeEach(() => {
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show']);

    TestBed.configureTestingModule({
      providers: [{ provide: LoadingService, useValue: loadingServiceSpy }],
    });

    mockLoadingService = TestBed.inject(
      LoadingService
    ) as jasmine.SpyObj<LoadingService>;
    mockNext = jasmine
      .createSpy('next')
      .and.returnValue(of(new HttpResponse({ status: 200 })));
  });

  it('should show loading and hide after request completes', (done) => {
    const mockRequest = new HttpRequest('GET', '/test');

    TestBed.runInInjectionContext(() => {
      loadingInterceptor(mockRequest, mockNext).subscribe({
        next: () => {
          expect(mockLoadingService.show).toHaveBeenCalledWith(true);
          expect(mockNext).toHaveBeenCalledWith(mockRequest);
        },
        complete: () => {
          setTimeout(() => {
            expect(mockLoadingService.show).toHaveBeenCalledWith(true);
            expect(mockLoadingService.show).toHaveBeenCalledWith(false);
            done();
          }, 0);
        },
      });
    });
  });

  it('should hide loading even if request fails', (done) => {
    const mockRequest = new HttpRequest('GET', '/test');
    mockNext.and.returnValue(throwError(() => new Error('Request failed')));

    TestBed.runInInjectionContext(() => {
      loadingInterceptor(mockRequest, mockNext).subscribe({
        next: () => {
          expect(mockLoadingService.show).toHaveBeenCalledWith(true);
        },
        error: () => {
          setTimeout(() => {
            expect(mockLoadingService.show).toHaveBeenCalledWith(true);
            expect(mockLoadingService.show).toHaveBeenCalledWith(false);
            done();
          }, 0);
        },
      });
    });
  });
});
