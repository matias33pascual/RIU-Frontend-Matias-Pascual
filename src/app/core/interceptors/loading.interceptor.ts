import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { DELAY_MS } from '@constants';
import { LoadingService } from '@core/services/loading.service';
import { delay } from 'rxjs/internal/operators/delay';
import { finalize } from 'rxjs/internal/operators/finalize';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  loadingService.show(true);

  return next(req).pipe(
    delay(DELAY_MS),
    finalize(() => loadingService.show(false))
  );
};
