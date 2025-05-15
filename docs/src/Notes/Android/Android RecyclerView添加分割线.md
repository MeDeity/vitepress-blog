---
title: "Android RecyclerView添加分割线笔记"
outline: deep
desc: "Android RecyclerView添加分割线笔记"
tags: "Android"
updateTime: "2025-05-14"
---
### 系统内置分割线

line_divider.xml文件定义分割线的样式
```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle">
    <size android:height="1dp" />
    <solid android:color="#DDDDDD" />
</shape>
```

添加系统分割线
```java
@BindView(R.id.recycler_view)
EasyRecyclerView mRecyclerView;


DividerItemDecoration dividerItemDecoration = new DividerItemDecoration(mRecyclerView.getContext(),layoutManager.getOrientation());
Drawable customDivider = ContextCompat.getDrawable(getActivity(), R.drawable.line_divider);
if (customDivider != null) {
    dividerItemDecoration.setDrawable(customDivider);
}
mRecyclerView.addItemDecoration(dividerItemDecoration);
```
这种方式添加的分割线，是充满宽度的,但是UI设计师给的分割线，往往是有一定间距的，所以这种方式不太适合。需要自定义分割线

```java
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Rect;
import android.graphics.drawable.Drawable;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.widget.LinearLayout;

public class CustomDividerItemDecoration extends RecyclerView.ItemDecoration {

    public static final int HORIZONTAL_LIST = LinearLayoutManager.HORIZONTAL;
    public static final int VERTICAL_LIST = LinearLayoutManager.VERTICAL;

    private Drawable mDivider;
    private int mOrientation;
    // 左边距，单位像素
    private int mLeftMarginPx; 
    // 右边距，单位像素
    private int mRightMarginPx; 

    /**
     * 构造函数
     * @param context 上下文
     * @param orientation 列表方向
     * @param divider Drawable 作为分割线
     * @param leftMarginPx 左边距，单位像素
     * @param rightMarginPx 右边距，单位像素
     */
    public CustomDividerItemDecoration(Context context, int orientation, Drawable divider, int leftMarginPx,int rightMarginPx) {
        this.mDivider = divider;
        this.mLeftMarginPx = leftMarginPx;
        this.mRightMarginPx = rightMarginPx;
        setOrientation(orientation);
    }

    public void setOrientation(int orientation) {
        if (orientation != HORIZONTAL_LIST && orientation != VERTICAL_LIST) {
            throw new IllegalArgumentException("invalid orientation");
        }
        mOrientation = orientation;
    }

    @Override
    public void onDraw(Canvas c, RecyclerView parent, RecyclerView.State state) {
        if (mOrientation == VERTICAL_LIST) {
            drawVertical(c, parent);
        } else {
            drawHorizontal(c, parent);
        }
    }

    public void drawVertical(Canvas c, RecyclerView parent) {
        final int left = parent.getPaddingLeft() + mLeftMarginPx; // 应用左边距
        final int right = parent.getWidth() - parent.getPaddingRight() - mRightMarginPx;

        final int childCount = parent.getChildCount();
        for (int i = 0; i < childCount - 1; i++) { // 不为最后一个item绘制下分割线
            final View child = parent.getChildAt(i);
            final RecyclerView.LayoutParams params = (RecyclerView.LayoutParams) child
                    .getLayoutParams();
            final int top = child.getBottom() + params.bottomMargin;
            final int bottom = top + mDivider.getIntrinsicHeight();
            mDivider.setBounds(left, top, right, bottom);
            mDivider.draw(c);
        }
    }

    public void drawHorizontal(Canvas c, RecyclerView parent) {
        final int top = parent.getPaddingTop();
        final int bottom = parent.getHeight() - parent.getPaddingBottom();

        final int childCount = parent.getChildCount();
        for (int i = 0; i < childCount - 1; i++) { // 不为最后一个item绘制右分割线
            final View child = parent.getChildAt(i);
            final RecyclerView.LayoutParams params = (RecyclerView.LayoutParams) child
                    .getLayoutParams();
            final int left = child.getRight() + params.rightMargin;
            final int right = left + mDivider.getIntrinsicHeight(); // 注意这里是getIntrinsicHeight，因为水平分割线的宽度由Drawable高度决定
            mDivider.setBounds(left, top, right, bottom);
            mDivider.draw(c);
        }
    }

    @Override
    public void getItemOffsets(Rect outRect, View view, RecyclerView parent, RecyclerView.State state) {
        int position = parent.getChildAdapterPosition(view);
        // 不为最后一个item设置offset
        if (position == parent.getAdapter().getItemCount() - 1) {
            outRect.set(0, 0, 0, 0);
            return;
        }

        if (mOrientation == VERTICAL_LIST) {
            outRect.set(0, 0, 0, mDivider.getIntrinsicHeight());
        } else {
            outRect.set(0, 0, mDivider.getIntrinsicWidth(), 0);
        }
    }
}
```

使用上
```java
// 添加自定义分割线
Drawable customDivider = ContextCompat.getDrawable(getActivity(), R.drawable.line_divider);
if (customDivider != null) {
    // 设置左边距，例如72dp。你需要根据你的布局调整这个值。
    // 16dp (图标和文字间距) + 56dp (图标宽度) = 72dp
    // 你也可以直接在 item_layout.xml 中测量应用图标和文字部分的左边距
    int leftMarginDp = 72; // 单位 dp
    int rightMarginDp = 15; // 单位 dp
    int leftMarginPx = (int) (leftMarginDp * getResources().getDisplayMetrics().density);
    int rightMarginPx = (int) (rightMarginDp * getResources().getDisplayMetrics().density);

    CustomDividerItemDecoration itemDecoration = new CustomDividerItemDecoration(
            mRecyclerView.getContext(),
            layoutManager.getOrientation(),
            customDivider,
            leftMarginPx,
            rightMarginPx
    );
    mRecyclerView.addItemDecoration(itemDecoration);
}
```

这样，你就能够为你的 RecyclerView 添加自定义的分割线，并且可以控制左边距和右边距。效果如下:

![最终效果](images/2025/05/15/最终效果.png)